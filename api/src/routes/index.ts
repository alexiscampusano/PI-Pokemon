import { Router } from 'express';
import pokemonRoutes from './pokemon.routes';
import typeRoutes from './type.routes';

const router = Router();

router.use('/pokemons', pokemonRoutes);
router.use('/types', typeRoutes);

export default router;
