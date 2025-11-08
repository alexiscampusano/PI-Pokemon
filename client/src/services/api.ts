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
  headers: {
    'Content-Type': 'application/json',
  },
});

export const pokemonAPI = {
  getAll: async (filters?: PokemonFilters): Promise<ApiResponse<Pokemon[]>> => {
    const params = new URLSearchParams();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
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

  create: async (pokemon: CreatePokemonPayload): Promise<ApiResponse<Pokemon>> => {
    const response = await api.post<ApiResponse<Pokemon>>('/pokemons', pokemon);
    return response.data;
  },

  delete: async (id: string | number): Promise<ApiResponse<null>> => {
    const response = await api.delete<ApiResponse<null>>(`/pokemons/${id}`);
    return response.data;
  },

  getAllTypes: async (): Promise<ApiResponse<PokemonType[]>> => {
    const response = await api.get<ApiResponse<PokemonType[]>>('/types');
    return response.data;
  },
};
