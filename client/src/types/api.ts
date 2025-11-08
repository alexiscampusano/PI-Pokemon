// API Response Types matching backend structure

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

export interface PokemonType {
  id?: number;
  name: string;
}

export interface Pokemon {
  id: number | string;
  name: string;
  sprite: string;
  types: PokemonType[];
  hp: number;
  attack: number;
  defense: number;
  speed: number;
  height: number;
  weight: number;
  createdInDb?: boolean;
}

export interface PokemonFilters {
  page?: number;
  limit?: number;
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
  sortBy?: 'id' | 'name' | 'hp' | 'attack' | 'defense' | 'speed';
  order?: 'ASC' | 'DESC';
}

export interface CreatePokemonPayload {
  name: string;
  hp: number;
  attack: number;
  defense: number;
  speed: number;
  weight: number;
  height: number;
  sprite?: string;
  types: string[];
}
