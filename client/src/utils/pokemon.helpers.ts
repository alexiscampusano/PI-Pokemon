import type { Pokemon, PokemonType } from '../types/api';

export const isPokemonFromDB = (pokemon: Pokemon): boolean => {
  return pokemon.createdInDb === true;
};

export const isPokemonFromAPI = (pokemon: Pokemon): boolean => {
  return !isPokemonFromDB(pokemon);
};

export const getTypeColor = (typeName: string): string => {
  const typeColors: Record<string, string> = {
    normal: '#A8A878',
    fire: '#F08030',
    water: '#6890F0',
    electric: '#F8D030',
    grass: '#78C850',
    ice: '#98D8D8',
    fighting: '#C03028',
    poison: '#A040A0',
    ground: '#E0C068',
    flying: '#A890F0',
    psychic: '#F85888',
    bug: '#A8B820',
    rock: '#B8A038',
    ghost: '#705898',
    dragon: '#7038F8',
    dark: '#705848',
    steel: '#B8B8D0',
    fairy: '#EE99AC',
  };

  return typeColors[typeName.toLowerCase()] || '#68A090';
};

export const sortPokemonsByName = (pokemons: Pokemon[], order: 'asc' | 'desc' = 'asc'): Pokemon[] => {
  return [...pokemons].sort((a, b) => {
    const comparison = a.name.localeCompare(b.name);
    return order === 'asc' ? comparison : -comparison;
  });
};

export const sortPokemonsByStat = (
  pokemons: Pokemon[],
  stat: 'hp' | 'attack' | 'defense' | 'speed',
  order: 'asc' | 'desc' = 'desc'
): Pokemon[] => {
  return [...pokemons].sort((a, b) => {
    const aStat = a[stat] || 0;
    const bStat = b[stat] || 0;
    return order === 'asc' ? aStat - bStat : bStat - aStat;
  });
};

export const filterPokemonsByType = (pokemons: Pokemon[], typeName: string): Pokemon[] => {
  if (!typeName || typeName === 'All') return pokemons;
  
  return pokemons.filter((pokemon) =>
    pokemon.types.some((type) => type.name.toLowerCase() === typeName.toLowerCase())
  );
};

export const searchPokemonsByName = (pokemons: Pokemon[], query: string): Pokemon[] => {
  if (!query.trim()) return pokemons;
  
  const lowerQuery = query.toLowerCase().trim();
  return pokemons.filter((pokemon) =>
    pokemon.name.toLowerCase().includes(lowerQuery)
  );
};

export const getTypeNames = (types: PokemonType[]): string[] => {
  return types.map((t) => t.name);
};

