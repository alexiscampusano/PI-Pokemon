import { Request } from 'express';

import { PokemonAttributes } from '../types';

export interface ParsedFilters {
  page: number;
  limit: number;
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
  sortBy?: keyof PokemonAttributes;
  order?: 'ASC' | 'DESC';
}

export const parseQueryFilters = (query: Request['query']): ParsedFilters => {
  const {
    page = '1',
    limit = '12',
    name,
    type,
    minHp,
    maxHp,
    minAttack,
    maxAttack,
    minDefense,
    maxDefense,
    minSpeed,
    maxSpeed,
    createdInDb,
    sortBy = 'id',
    order = 'ASC',
  } = query;

  return {
    page: parseInt(page as string, 10) || 1,
    limit: parseInt(limit as string, 10) || 12,
    name: name as string | undefined,
    type: type as string | undefined,
    minHp: minHp ? Number(minHp) : undefined,
    maxHp: maxHp ? Number(maxHp) : undefined,
    minAttack: minAttack ? Number(minAttack) : undefined,
    maxAttack: maxAttack ? Number(maxAttack) : undefined,
    minDefense: minDefense ? Number(minDefense) : undefined,
    maxDefense: maxDefense ? Number(maxDefense) : undefined,
    minSpeed: minSpeed ? Number(minSpeed) : undefined,
    maxSpeed: maxSpeed ? Number(maxSpeed) : undefined,
    createdInDb: createdInDb ? String(createdInDb).toLowerCase() === 'true' : undefined,
    sortBy: sortBy as keyof PokemonAttributes,
    order: order as 'ASC' | 'DESC',
  };
};
