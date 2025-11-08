export const ROUTES = {
  LANDING: '/',
  HOME: '/pokemons',
  POKEMON_DETAILS: '/pokemons/:id',
  CREATE_POKEMON: '/pokemon',
} as const;

export const getRoutes = {
  landing: () => ROUTES.LANDING,
  home: () => ROUTES.HOME,
  pokemonDetails: (id: string | number) => `/pokemons/${id}`,
  createPokemon: () => ROUTES.CREATE_POKEMON,
} as const;

