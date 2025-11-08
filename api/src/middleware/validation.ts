import { Request, Response, NextFunction } from 'express';
import { AppError } from './errorHandler';
import { HttpStatus } from '../constants/httpStatus';

export const validatePokemonCreation = (req: Request, _res: Response, next: NextFunction) => {
  const { name, types, hp, attack, defense, speed, height, weight } = req.body;

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    throw new AppError('Name is required and must be a non-empty string', HttpStatus.BAD_REQUEST);
  }

  if (!types || !Array.isArray(types) || types.length === 0) {
    throw new AppError('Types are required and must be a non-empty array', HttpStatus.BAD_REQUEST);
  }

  if (!types.every((type): type is string => typeof type === 'string')) {
    throw new AppError('All types must be strings', HttpStatus.BAD_REQUEST);
  }

  const numericFields = { hp, attack, defense, speed, height, weight };

  for (const [key, value] of Object.entries(numericFields)) {
    if (value === undefined) continue;

    if (typeof value !== 'number' || value < 0) {
      throw new AppError(`${key} must be a positive number`, HttpStatus.BAD_REQUEST);
    }
  }

  next();
};

export const validatePaginationParams = (req: Request, _res: Response, next: NextFunction) => {
  const { page, limit } = req.query;

  if (page !== undefined) {
    const pageNum = parseInt(page as string);
    if (isNaN(pageNum) || pageNum < 1) {
      throw new AppError('Page must be a positive integer', HttpStatus.BAD_REQUEST);
    }
  }

  if (limit !== undefined) {
    const limitNum = parseInt(limit as string);
    if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
      throw new AppError('Limit must be between 1 and 100', HttpStatus.BAD_REQUEST);
    }
  }

  next();
};
