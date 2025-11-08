import { Router, Request, Response } from 'express';
import axios from 'axios';
import { Pokemon, Type } from '../db';

const router = Router();

// Interfaces for Pokemon API response
interface PokeApiType {
  type: {
    name: string;
  };
}

interface PokeApiResponse {
  id: number;
  name: string;
  stats: Array<{ base_stat: number }>;
  height: number;
  weight: number;
  sprites: {
    other: {
      'official-artwork': {
        front_default: string;
      };
    };
  };
  types: PokeApiType[];
}

interface PokemonInfo {
  id: number | string;
  name: string;
  hp: number;
  attack: number;
  defense: number;
  speed: number;
  height: number;
  weight: number;
  sprite: string;
  types: Array<{ name: string }>;
  createdInDb?: boolean;
}

const getApiInfo = async (): Promise<PokemonInfo[]> => {
  try {
    const pokeApi = await axios.get('https://pokeapi.co/api/v2/pokemon');
    const pokeApiNext = await axios.get(pokeApi.data.next);
    const totalPokeApi = pokeApi.data.results.concat(pokeApiNext.data.results);

    const apiUrl = totalPokeApi.map((e: { url: string }) => axios.get<PokeApiResponse>(e.url));

    const apiInfo = await Promise.all(apiUrl).then((responses) => {
      const pokemons = responses.map((e) => e.data);

      const info: PokemonInfo[] = pokemons.map((e) => ({
        id: e.id,
        name: e.name,
        hp: e.stats[0].base_stat,
        attack: e.stats[1].base_stat,
        defense: e.stats[2].base_stat,
        speed: e.stats[5].base_stat,
        height: e.height,
        weight: e.weight,
        sprite: e.sprites.other['official-artwork'].front_default,
        types:
          e.types.length < 2
            ? [{ name: e.types[0].type.name }]
            : [
                { name: e.types[0].type.name },
                { name: e.types[1].type.name },
              ],
      }));

      return info;
    });

    return apiInfo;
  } catch (err) {
    console.error('Error fetching API info:', err);
    return [];
  }
};

const getDbInfo = async (): Promise<any[]> => {
  return await Pokemon.findAll({
    include: {
      model: Type,
      attributes: ['name'],
      through: {
        attributes: [],
      },
    },
  });
};

const getAllPokemons = async (): Promise<PokemonInfo[]> => {
  const apiInfo = await getApiInfo();
  const dbInfo = await getDbInfo();
  const infoTotal = [...apiInfo, ...dbInfo];
  return infoTotal;
};

// GET /pokemons
router.get('/pokemons', async (req: Request, res: Response) => {
  try {
    const name = req.query.name as string | undefined;
    const pokemonsTotal = await getAllPokemons();

    if (name) {
      const pokemonName = pokemonsTotal.filter((e) =>
        e.name.toLowerCase().includes(name.toLowerCase())
      );
      
      if (pokemonName.length) {
        res.status(200).json(pokemonName);
      } else {
        res.status(404).json({ message: 'Pokemon not found' });
      }
    } else {
      res.status(200).json(pokemonsTotal);
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /pokemons/:id
router.get('/pokemons/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const pokemonTotal = await getAllPokemons();

    if (id) {
      const pokemonId = pokemonTotal.filter((e) => e.id == id);
      
      if (pokemonId.length) {
        res.status(200).json(pokemonId);
      } else {
        res.status(404).json({ message: 'Pokemon not found' });
      }
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /types
router.get('/types', async (_req: Request, res: Response) => {
  try {
    const typesApi = await axios.get('https://pokeapi.co/api/v2/type');
    const types = typesApi.data.results.map((e: { name: string }) => e.name);

    for (const typeName of types) {
      await Type.findOrCreate({
        where: {
          name: typeName,
        },
      });
    }

    const allTypes = await Type.findAll();
    res.status(200).json(allTypes);
  } catch (err) {
    console.error('Error fetching types:', err);
    res.status(500).json({ error: 'Failed to fetch types' });
  }
});

// POST /pokemon
interface CreatePokemonBody {
  name: string;
  hp: number;
  attack: number;
  defense: number;
  speed: number;
  height: number;
  weight: number;
  sprite?: string;
  types: string[];
  createdInDb?: boolean;
}

router.post('/pokemon', async (req: Request<{}, {}, CreatePokemonBody>, res: Response) => {
  try {
    const {
      name,
      hp,
      attack,
      defense,
      speed,
      height,
      weight,
      sprite,
      types,
      createdInDb,
    } = req.body;

    const pokemonCreated = await Pokemon.create({
      name,
      hp,
      attack,
      defense,
      speed,
      height,
      weight,
      sprite,
      createdInDb: createdInDb ?? true,
    });

    const typeDb = await Type.findAll({ where: { name: types } });

    // @ts-ignore - Sequelize association methods
    await pokemonCreated.addType(typeDb);
    res.status(200).json({ message: 'Pokemon created', pokemon: pokemonCreated });
  } catch (error) {
    console.error('Error creating pokemon:', error);
    res.status(500).json({ error: 'Failed to create pokemon' });
  }
});

export default router;

