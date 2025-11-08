import { Request, Response } from 'express';
import { sendSuccess, sendPaginated } from '../utils/response';
import { AppError } from '../middleware/errorHandler';
import { parseQueryFilters } from '../utils/queryParser';
import { HttpStatus } from '../constants/httpStatus';
import pokemonService from '../services/pokemonService';

export const getAllPokemons = async (req: Request, res: Response) => {
  const filters = parseQueryFilters(req.query);
  const result = await pokemonService.getAll(filters);

  return sendPaginated(res, result.data, result.page, result.limit, result.total);
};

export const getPokemonById = async (req: Request, res: Response) => {
  const { id } = req.params;

  const pokemon = await pokemonService.getById(id);

  if (!pokemon) {
    throw new AppError('Pokemon not found', HttpStatus.NOT_FOUND);
  }

  return sendSuccess(res, pokemon);
};

export const createPokemon = async (req: Request, res: Response) => {
  const { name, hp, attack, defense, speed, height, weight, sprite, types } = req.body;

  try {
    const pokemon = await pokemonService.create({
      name,
      hp,
      attack,
      defense,
      speed,
      height,
      weight,
      sprite,
      types,
    });

    return sendSuccess(res, pokemon, 'Pokemon created successfully', HttpStatus.CREATED);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'Pokemon with this name already exists') {
        throw new AppError(error.message, HttpStatus.CONFLICT);
      }
      if (error.message === 'No valid types found') {
        throw new AppError(error.message, HttpStatus.BAD_REQUEST);
      }
    }
    throw error;
  }
};

export const deletePokemon = async (req: Request, res: Response) => {
  const { id } = req.params;

  const deleted = await pokemonService.delete(id);

  if (!deleted) {
    throw new AppError('Pokemon not found', HttpStatus.NOT_FOUND);
  }

  return sendSuccess(res, null, 'Pokemon deleted successfully', HttpStatus.NO_CONTENT);
};
