import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:3001';

// Types & Interfaces
export interface PokemonType {
  id: number;
  name: string;
}

export interface Pokemon {
  id: number | string;
  name: string;
  sprite: string;
  types: PokemonType[];
  hp?: number;
  attack?: number;
  defense?: number;
  speed?: number;
  height?: number;
  weight?: number;
  createdInDb?: boolean;
}

export interface PokemonState {
  pokemons: Pokemon[];
  allPokemons: Pokemon[];
  types: PokemonType[];
  details: Pokemon | null;
  loading: boolean;
  error: string | null;
}

// Thunks asíncronos
export const fetchAllPokemons = createAsyncThunk<Pokemon[]>('pokemon/fetchAll', async () => {
  const response = await axios.get<Pokemon[]>(`${API_URL}/pokemons`);
  return response.data;
});

export const fetchPokemonByName = createAsyncThunk<Pokemon[], string>(
  'pokemon/fetchByName',
  async (name: string) => {
    const response = await axios.get<Pokemon[]>(`${API_URL}/pokemons?name=${name}`);
    return response.data;
  }
);

export const fetchPokemonDetails = createAsyncThunk<Pokemon, string | number>(
  'pokemon/fetchDetails',
  async (id: string | number) => {
    const response = await axios.get<Pokemon>(`${API_URL}/pokemons/${id}`);
    return response.data;
  }
);

export const fetchTypes = createAsyncThunk<PokemonType[]>('pokemon/fetchTypes', async () => {
  const response = await axios.get<PokemonType[]>(`${API_URL}/types`);
  return response.data;
});

export interface CreatePokemonPayload {
  name: string;
  hp: number;
  attack: number;
  defense: number;
  speed: number;
  weight: number;
  height: number;
  types: string[];
}

export const createPokemon = createAsyncThunk<Pokemon, CreatePokemonPayload>(
  'pokemon/create',
  async (pokemonData: CreatePokemonPayload) => {
    const response = await axios.post<Pokemon>(`${API_URL}/pokemon`, pokemonData);
    return response.data;
  }
);

const initialState: PokemonState = {
  pokemons: [],
  allPokemons: [],
  types: [],
  details: null,
  loading: false,
  error: null,
};

const pokemonSlice = createSlice({
  name: 'pokemon',
  initialState,
  reducers: {
    // Filtros y ordenamiento - acciones síncronas
    filterByType: (state, action: PayloadAction<string>) => {
      if (action.payload === 'All') {
        state.pokemons = state.allPokemons;
      } else {
        state.pokemons = state.allPokemons.filter((pokemon) =>
          pokemon.types.some((type) => type.name === action.payload)
        );
      }
    },
    filterByCreated: (state, action: PayloadAction<string>) => {
      if (action.payload === 'All') {
        state.pokemons = state.allPokemons;
      } else if (action.payload === 'Created') {
        state.pokemons = state.allPokemons.filter((p) => p.createdInDb);
      } else {
        state.pokemons = state.allPokemons.filter((p) => !p.createdInDb);
      }
    },
    orderByName: (state, action: PayloadAction<'Asc' | 'Desc'>) => {
      const sorted = [...state.pokemons].sort((a, b) => {
        if (action.payload === 'Asc') {
          return a.name.localeCompare(b.name);
        }
        return b.name.localeCompare(a.name);
      });
      state.pokemons = sorted;
    },
    orderByAttack: (state, action: PayloadAction<'Asc' | 'Desc'>) => {
      const sorted = [...state.pokemons].sort((a, b) => {
        const attackA = a.attack || 0;
        const attackB = b.attack || 0;
        if (action.payload === 'Asc') {
          return attackA - attackB;
        }
        return attackB - attackA;
      });
      state.pokemons = sorted;
    },
    cleanDetails: (state) => {
      state.details = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch all pokemons
    builder
      .addCase(fetchAllPokemons.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllPokemons.fulfilled, (state, action) => {
        state.loading = false;
        state.pokemons = action.payload;
        state.allPokemons = action.payload;
      })
      .addCase(fetchAllPokemons.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch pokemons';
      });

    // Fetch pokemon by name
    builder
      .addCase(fetchPokemonByName.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPokemonByName.fulfilled, (state, action) => {
        state.loading = false;
        state.pokemons = action.payload;
      })
      .addCase(fetchPokemonByName.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Pokemon not found';
      });

    // Fetch pokemon details
    builder
      .addCase(fetchPokemonDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPokemonDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.details = action.payload;
      })
      .addCase(fetchPokemonDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch details';
      });

    // Fetch types
    builder
      .addCase(fetchTypes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTypes.fulfilled, (state, action) => {
        state.loading = false;
        state.types = action.payload;
      })
      .addCase(fetchTypes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch types';
      });

    // Create pokemon
    builder
      .addCase(createPokemon.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPokemon.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createPokemon.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create pokemon';
      });
  },
});

export const { filterByType, filterByCreated, orderByName, orderByAttack, cleanDetails } =
  pokemonSlice.actions;

export default pokemonSlice.reducer;
