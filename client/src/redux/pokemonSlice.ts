import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { pokemonAPI } from '../services/api';
import { Pokemon, PokemonType, PokemonFilters, CreatePokemonPayload } from '../types/api';

export interface PokemonState {
  pokemons: Pokemon[];
  types: PokemonType[];
  details: Pokemon | null;
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  filters: PokemonFilters;
}

const initialState: PokemonState = {
  pokemons: [],
  types: [],
  details: null,
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
  },
  filters: {
    page: 1,
    limit: 12,
  },
};

// Async thunks
export const fetchPokemons = createAsyncThunk(
  'pokemon/fetchPokemons',
  async (filters: PokemonFilters, { rejectWithValue }) => {
    try {
      const response = await pokemonAPI.getAll(filters);
      if (!response.success) {
        return rejectWithValue(response.error || 'Failed to fetch pokemons');
      }
      return response;
    } catch (error) {
      return rejectWithValue('Network error');
    }
  }
);

export const fetchPokemonDetails = createAsyncThunk(
  'pokemon/fetchDetails',
  async (id: string | number, { rejectWithValue }) => {
    try {
      const response = await pokemonAPI.getById(id);
      if (!response.success) {
        return rejectWithValue(response.error || 'Failed to fetch pokemon');
      }
      return response.data;
    } catch (error) {
      return rejectWithValue('Network error');
    }
  }
);

export const fetchTypes = createAsyncThunk('pokemon/fetchTypes', async (_, { rejectWithValue }) => {
  try {
    const response = await pokemonAPI.getAllTypes();
    if (!response.success) {
      return rejectWithValue(response.error || 'Failed to fetch types');
    }
    return response.data;
  } catch (error) {
    return rejectWithValue('Network error');
  }
});

export const createPokemon = createAsyncThunk(
  'pokemon/create',
  async (pokemonData: CreatePokemonPayload, { rejectWithValue }) => {
    try {
      const response = await pokemonAPI.create(pokemonData);
      if (!response.success) {
        return rejectWithValue(response.error || 'Failed to create pokemon');
      }
      return response.data;
    } catch (error) {
      return rejectWithValue('Network error');
    }
  }
);

export const deletePokemon = createAsyncThunk(
  'pokemon/delete',
  async (id: string | number, { rejectWithValue }) => {
    try {
      const response = await pokemonAPI.delete(id);
      if (!response.success) {
        return rejectWithValue(response.error || 'Failed to delete pokemon');
      }
      return id;
    } catch (error) {
      return rejectWithValue('Network error');
    }
  }
);

const pokemonSlice = createSlice({
  name: 'pokemon',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<PokemonFilters>>) => {
      state.filters = {
        ...state.filters,
        ...action.payload,
        page: action.payload.page || 1,
      };
    },
    resetFilters: (state) => {
      state.filters = {
        page: 1,
        limit: 12,
      };
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.filters.page = action.payload;
    },
    cleanDetails: (state) => {
      state.details = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch pokemons
    builder
      .addCase(fetchPokemons.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPokemons.fulfilled, (state, action) => {
        state.loading = false;
        state.pokemons = action.payload.data || [];
        if (action.payload.pagination) {
          state.pagination = action.payload.pagination;
        }
      })
      .addCase(fetchPokemons.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch pokemon details
    builder
      .addCase(fetchPokemonDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPokemonDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.details = action.payload || null;
      })
      .addCase(fetchPokemonDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch types
    builder
      .addCase(fetchTypes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTypes.fulfilled, (state, action) => {
        state.loading = false;
        state.types = action.payload || [];
      })
      .addCase(fetchTypes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
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
        state.error = action.payload as string;
      });

    // Delete pokemon
    builder
      .addCase(deletePokemon.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePokemon.fulfilled, (state, action) => {
        state.loading = false;
        state.pokemons = state.pokemons.filter((p) => p.id !== action.payload);
      })
      .addCase(deletePokemon.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setFilters, resetFilters, setPage, cleanDetails, clearError } = pokemonSlice.actions;

export default pokemonSlice.reducer;
