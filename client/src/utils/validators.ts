import { POKEMON_STATS } from '../constants/config';

export const validatePokemonName = (name: string): string | null => {
  if (!name || name.trim().length === 0) {
    return 'Name is required';
  }
  if (name.trim().length < 2) {
    return 'Name must be at least 2 characters';
  }
  if (name.trim().length > 50) {
    return 'Name must be less than 50 characters';
  }
  return null;
};

export const validateStat = (
  value: string | number,
  statName: string
): string | null => {
  if (value === '' || value === undefined) return null;

  const numValue = typeof value === 'string' ? Number(value) : value;

  if (isNaN(numValue)) {
    return `${statName} must be a number`;
  }

  if (numValue < POKEMON_STATS.MIN_VALUE) {
    return `${statName} must be at least ${POKEMON_STATS.MIN_VALUE}`;
  }

  if (numValue > POKEMON_STATS.MAX_VALUE) {
    return `${statName} cannot exceed ${POKEMON_STATS.MAX_VALUE}`;
  }

  return null;
};

export const validateTypes = (types: string[]): string | null => {
  if (!types || types.length === 0) {
    return 'At least one type is required';
  }
  if (types.length > 2) {
    return 'A Pokemon can have at most 2 types';
  }
  return null;
};

export const validateUrl = (url: string): string | null => {
  if (!url) return null;

  try {
    new URL(url);
    return null;
  } catch {
    return 'Invalid URL format';
  }
};

