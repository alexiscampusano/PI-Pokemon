import { Router } from 'express';
import { getAllTypes } from '../controllers/typeController';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

router.get('/', asyncHandler(getAllTypes));

export default router;
