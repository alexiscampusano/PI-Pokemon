import { Request, Response } from 'express';
import { sendSuccess } from '../utils/response';
import typeService from '../services/typeService';

export const getAllTypes = async (_req: Request, res: Response) => {
  const types = await typeService.getAll();
  return sendSuccess(res, types);
};
