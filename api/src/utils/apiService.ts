import axios from 'axios';
import { PokemonAttributes } from '../types';

const POKEAPI_BASE_URL = 'https://pokeapi.co/api/v2';
const POKEMON_LIMIT = 40;

export const fetchPokemonFromAPI = async (): Promise<PokemonAttributes[]> => {
  try {
    const response = await axios.get(`${POKEAPI_BASE_URL}/pokemon?limit=${POKEMON_LIMIT}`);
    const results = response.data.results;

    const pokemonDetailsPromises = results.map(async (p: { url: string }) => {
      const detail = await axios.get(p.url);
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
    });

    return await Promise.all(pokemonDetailsPromises);
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
