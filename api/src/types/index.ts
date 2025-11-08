export interface PokemonAttributes {
  id: string | number;
  name: string;
  hp: number;
  attack: number;
  defense: number;
  speed: number;
  height: number;
  weight: number;
  sprite: string;
  createdInDb?: boolean;
  types?: TypeAttributes[];
}

export interface TypeAttributes {
  id?: number;
  name: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
  offset: number;
}

export interface PokemonFilters {
  name?: string;
  type?: string;
  minHp?: number;
  maxHp?: number;
  minAttack?: number;
  maxAttack?: number;
  minDefense?: number;
  maxDefense?: number;
  minSpeed?: number;
  maxSpeed?: number;
  createdInDb?: boolean;
}

export interface PokemonQuery extends PaginationParams, PokemonFilters {
  sortBy?: 'name' | 'hp' | 'attack' | 'defense' | 'speed' | 'id';
  order?: 'ASC' | 'DESC';
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
