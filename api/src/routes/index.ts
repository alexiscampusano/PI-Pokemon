import { Router } from 'express';
import pokemonRoutes from './pokemon.routes';
import typeRoutes from './type.routes';
import searchRoutes from './search.routes';

const router = Router();

router.use('/pokemons', pokemonRoutes);
router.use('/types', typeRoutes);
router.use('/search', searchRoutes);

export default router;
