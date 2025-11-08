import { Router } from 'express';
import {
  getAllPokemons,
  getPokemonById,
  createPokemon,
  deletePokemon,
} from '../controllers/pokemonController';
import { validatePokemonCreation, validatePaginationParams } from '../middleware/validation';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

router.get('/', validatePaginationParams, asyncHandler(getAllPokemons));
router.get('/:id', asyncHandler(getPokemonById));
router.post('/', validatePokemonCreation, asyncHandler(createPokemon));
router.delete('/:id', asyncHandler(deletePokemon));

export default router;
