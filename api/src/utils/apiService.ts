import axios from 'axios';
import { PokemonAttributes } from '../types';

const POKEAPI_BASE_URL = 'https://pokeapi.co/api/v2';
const POKEMON_LIMIT = 1025; // Gen 1-9 pokemons (official national dex)

export const fetchPokemonFromAPI = async (): Promise<PokemonAttributes[]> => {
  try {
    const response = await axios.get(`${POKEAPI_BASE_URL}/pokemon?limit=${POKEMON_LIMIT}`, {
      timeout: 10000, // 10 seconds timeout for list
    });
    const results = response.data.results;

    const pokemonDetailsPromises = results.map(async (p: { url: string }) => {
      try {
        const detail = await axios.get(p.url, {
          timeout: 5000, // 5 seconds timeout per pokemon
        });
        const data = detail.data;

        return {
          id: data.id,
          name: data.name,
          hp: data.stats[0].base_stat,
          attack: data.stats[1].base_stat,
          defense: data.stats[2].base_stat,
          speed: data.stats[5].base_stat,
          height: data.height,
          weight: data.weight,
          sprite: data.sprites.other['official-artwork'].front_default,
          types: data.types.map((t: { type: { name: string } }) => ({
            name: t.type.name,
          })),
        };
      } catch (err) {
        console.error(`Error fetching pokemon ${p.url}:`, err instanceof Error ? err.message : err);
        return null;
      }
    });

    const allResults = await Promise.all(pokemonDetailsPromises);
    const validPokemons = allResults.filter((p): p is PokemonAttributes => p !== null);
    
    console.warn(`✅ Successfully fetched ${validPokemons.length}/${results.length} pokemons from API`);
    return validPokemons;
  } catch (err) {
    console.error('Error fetching from PokeAPI:', err);
    return [];
  }
};

export const fetchTypesFromAPI = async (): Promise<string[]> => {
  try {
    const response = await axios.get(`${POKEAPI_BASE_URL}/type`);
    return response.data.results.map((t: { name: string }) => t.name);
  } catch (err) {
    console.error('Error fetching types from PokeAPI:', err);
    return [];
  }
};
