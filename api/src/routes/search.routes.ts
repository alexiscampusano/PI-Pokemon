import { Router } from 'express';
import { searchPokemons } from '../controllers/searchController';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

router.get('/', asyncHandler(searchPokemons));

export default router;

