import * as PesticideController from '../app/http/controllers/pesticide.controller';
import express from 'express';
import isAuth from '../app/http/middlewares/auth.middleware';

const PesticideRouter = express.Router();

PesticideRouter.post('/create', isAuth, PesticideController.createPesticide);
PesticideRouter.get('/get-pesticide-by-id-pest/:id', PesticideController.getPesticedeByIdPest);
PesticideRouter.get('/', PesticideController.getAllPesticides);

export default PesticideRouter;
