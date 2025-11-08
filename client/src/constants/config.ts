export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:3001',
  ENDPOINTS: {
    POKEMONS: '/api/pokemons',
    POKEMON_BY_ID: (id: string | number) => `/api/pokemons/${id}`,
    TYPES: '/api/types',
    CREATE_POKEMON: '/api/pokemons',
    DELETE_POKEMON: (id: string | number) => `/api/pokemons/${id}`,
  },
  TIMEOUT: 30000,
} as const;

export const APP_CONFIG = {
  DEFAULT_PAGE_SIZE: 12,
  MAX_PAGE_SIZE: 100,
  DEBOUNCE_DELAY: 500,
  CACHE_TIME: 5 * 60 * 1000, // 5 minutes
} as const;

export const POKEMON_STATS = {
  MIN_VALUE: 0,
  MAX_VALUE: 255,
  DEFAULT_HP: 100,
  DEFAULT_ATTACK: 100,
  DEFAULT_DEFENSE: 100,
  DEFAULT_SPEED: 100,
} as const;

