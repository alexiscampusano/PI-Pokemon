import axios from 'axios';
import {
  ApiResponse,
  Pokemon,
  PokemonType,
  PokemonFilters,
  CreatePokemonPayload,
} from '../types/api';

const API_URL = 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_URL,
});

export const pokemonAPI = {
  getAll: async (filters?: PokemonFilters): Promise<ApiResponse<Pokemon[]>> => {
    const params = new URLSearchParams();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, String(value));
        }
      });
    }

    const response = await api.get<ApiResponse<Pokemon[]>>(`/pokemons?${params.toString()}`);
    return response.data;
  },

  getById: async (id: string | number): Promise<ApiResponse<Pokemon>> => {
    const response = await api.get<ApiResponse<Pokemon>>(`/pokemons/${id}`);
    return response.data;
  },

  search: async (query: string): Promise<ApiResponse<Pokemon[]>> => {
    const response = await api.get<ApiResponse<Pokemon[]>>(`/search?q=${encodeURIComponent(query)}`);
    return response.data;
  },

  getTypes: async (): Promise<ApiResponse<PokemonType[]>> => {
    const response = await api.get<ApiResponse<PokemonType[]>>('/types');
    return response.data;
  },

  createPokemon: async (
    pokemonData: CreatePokemonPayload
  ): Promise<ApiResponse<Pokemon>> => {
    const response = await api.post<ApiResponse<Pokemon>>('/pokemons', pokemonData);
    return response.data;
  },
};
