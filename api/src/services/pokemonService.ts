import { Pokemon, Type } from '../db';
import { PokemonAttributes } from '../types';
import { fetchPokemonFromAPI } from '../utils/apiService';
import { HttpStatus } from '../constants/httpStatus';
import { AppError } from '../middleware/errorHandler';
import cacheService from './cacheService';

interface ServiceFilters {
  page?: number;
  limit?: number;
  name?: string;
  type?: string;
  minHp?: number;
  maxHp?: number;
  minAttack?: number;
  maxAttack?: number;
  minDefense?: number;
  maxDefense?: number;
  minSpeed?: number;
  maxSpeed?: number;
  createdInDb?: boolean;
  sortBy?: keyof PokemonAttributes;
  order?: 'ASC' | 'DESC';
}

export class PokemonService {
  async getAll(filters: ServiceFilters) {
    let apiPokemons: PokemonAttributes[] = [];

    const cachedPokemons = await cacheService.getAllPokemons();

    if (cachedPokemons) {
      console.warn('📦 Using cached pokemons from Redis');
      apiPokemons = cachedPokemons;
    } else {
      console.warn('🔄 Fetching pokemons from PokeAPI... this may take a few minutes');
      apiPokemons = await fetchPokemonFromAPI();
      await cacheService.setAllPokemons(apiPokemons);
      console.warn('✅ Pokemons cached successfully');
    }

    const dbPokemons = await this.fetchFromDB();

    let allPokemons: PokemonAttributes[] = [...apiPokemons, ...dbPokemons];

    allPokemons = this.applyFilters(allPokemons, filters);
    allPokemons = this.applySorting(allPokemons, filters);

    const { page = 1, limit = 12 } = filters;
    const total = allPokemons.length;
    const offset = (page - 1) * limit;
    const paginatedData = allPokemons.slice(offset, offset + limit);

    return {
      data: paginatedData,
      page,
      limit,
      total,
    };
  }

  async getById(id: string | number) {
    const isNumericId = typeof id === 'number' || !isNaN(Number(id));

    if (isNumericId && Number(id) <= 1302) {
      const cachedPokemons = await cacheService.getAllPokemons();

      if (cachedPokemons) {
        const apiPokemon = cachedPokemons.find((p) => p.id == id);
        if (apiPokemon) return apiPokemon;
      }

      const apiPokemons = await fetchPokemonFromAPI();
      const apiPokemon = apiPokemons.find((p) => p.id == id);
      if (apiPokemon) return apiPokemon;
    }

    const dbPokemon = await Pokemon.findByPk(id, {
      include: {
        model: Type,
        attributes: ['name'],
        through: { attributes: [] },
      },
    });

    return dbPokemon;
  }

  async create(data: {
    name: string;
    hp?: number;
    attack?: number;
    defense?: number;
    speed?: number;
    height?: number;
    weight?: number;
    sprite?: string;
    types: string[];
  }) {
    const existingPokemon = await Pokemon.findOne({ where: { name: data.name } });
    if (existingPokemon) {
      throw new AppError('Pokemon with this name already exists', HttpStatus.CONFLICT);
    }

    const typeRecords = await Type.findAll({ where: { name: data.types } });
    if (typeRecords.length === 0) {
      throw new AppError('No valid types found', HttpStatus.BAD_REQUEST);
    }

    const { sequelize } = Pokemon;
    if (!sequelize) {
      throw new Error('Database connection not available');
    }

    const transaction = await sequelize.transaction();

    try {
      const pokemonCreated = await Pokemon.create(
        {
          name: data.name,
          hp: data.hp,
          attack: data.attack,
          defense: data.defense,
          speed: data.speed,
          height: data.height,
          weight: data.weight,
          sprite: data.sprite,
          createdInDb: true,
        },
        { transaction }
      );

      // @ts-ignore - Sequelize association methods
      await pokemonCreated.addType(typeRecords, { transaction });

      await transaction.commit();

      const pokemonWithTypes = await Pokemon.findByPk(pokemonCreated.get('id') as string, {
        include: {
          model: Type,
          attributes: ['name'],
          through: { attributes: [] },
        },
      });

      return pokemonWithTypes;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async delete(id: string) {
    const pokemon = await Pokemon.findByPk(id);

    if (!pokemon) {
      return null;
    }

    await pokemon.destroy();
    return true;
  }

  private async fetchFromDB(): Promise<PokemonAttributes[]> {
    const dbPokemons = await Pokemon.findAll({
      include: {
        model: Type,
        attributes: ['name'],
        through: { attributes: [] },
      },
    });

    // @ts-ignore - Sequelize types don't properly reflect included associations
    return dbPokemons.map((p) => ({
      id: p.id,
      name: p.name,
      hp: p.hp,
      attack: p.attack,
      defense: p.defense,
      speed: p.speed,
      height: p.height,
      weight: p.weight,
      sprite: p.sprite,
      createdInDb: p.createdInDb,
      // @ts-ignore - Sequelize association types
      types: p.types?.map((t: { name: string }) => ({ name: t.name })) || [],
    }));
  }

  private applyFilters(
    pokemons: PokemonAttributes[],
    filters: ServiceFilters
  ): PokemonAttributes[] {
    let filtered = pokemons;

    if (filters.name) {
      filtered = filtered.filter((p) => p.name.toLowerCase().includes(filters.name!.toLowerCase()));
    }

    if (filters.type) {
      filtered = filtered.filter((p) =>
        p.types?.some((t) => t.name.toLowerCase() === filters.type!.toLowerCase())
      );
    }

    if (filters.createdInDb !== undefined) {
      filtered = filtered.filter((p) => p.createdInDb === filters.createdInDb);
    }

    const statFilters: Array<{
      min?: number;
      max?: number;
      field: keyof Pick<PokemonAttributes, 'hp' | 'attack' | 'defense' | 'speed'>;
    }> = [
      { min: filters.minHp, max: filters.maxHp, field: 'hp' },
      { min: filters.minAttack, max: filters.maxAttack, field: 'attack' },
      { min: filters.minDefense, max: filters.maxDefense, field: 'defense' },
      { min: filters.minSpeed, max: filters.maxSpeed, field: 'speed' },
    ];

    statFilters.forEach(({ min, max, field }) => {
      if (min !== undefined) {
        filtered = filtered.filter((p) => p[field] >= min);
      }
      if (max !== undefined) {
        filtered = filtered.filter((p) => p[field] <= max);
      }
    });

    return filtered;
  }

  private applySorting(
    pokemons: PokemonAttributes[],
    filters: { sortBy?: keyof PokemonAttributes; order?: 'ASC' | 'DESC' }
  ): PokemonAttributes[] {
    const { sortBy = 'id', order = 'ASC' } = filters;

    return pokemons.sort((a, b) => {
      const aVal = a[sortBy];
      const bVal = b[sortBy];

      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return order === 'ASC' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }

      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return order === 'ASC' ? aVal - bVal : bVal - aVal;
      }

      return 0;
    });
  }
}

export default new PokemonService();
