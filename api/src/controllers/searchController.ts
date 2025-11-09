import { Request, Response } from 'express';
import { sendSuccess } from '../utils/response';
import pokemonService from '../services/pokemonService';
import { HttpStatus } from '../constants/httpStatus';

export const searchPokemons = async (req: Request, res: Response) => {
  const { q } = req.query;

  if (!q || typeof q !== 'string') {
    return sendSuccess(res, [], 'Query parameter required', HttpStatus.OK);
  }

  const query = q.trim().toLowerCase();

  if (query.length < 2) {
    return sendSuccess(res, [], 'Query must be at least 2 characters', HttpStatus.OK);
  }

  const results = await pokemonService.search(query, 8);

  return sendSuccess(res, results, undefined, HttpStatus.OK);
};

