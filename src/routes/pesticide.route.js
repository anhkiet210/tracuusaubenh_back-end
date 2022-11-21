import * as PesticideController from '../app/http/controllers/pesticide.controller';
import express from 'express';
import isAuthAdmin from '../app/http/middlewares/authAdmin.middleware';

const PesticideRouter = express.Router();

PesticideRouter.post('/create', isAuthAdmin, PesticideController.createPesticide);
PesticideRouter.put('/update/:id', isAuthAdmin, PesticideController.updatePesticide);
PesticideRouter.get('/get-pesticide-by-id-pest/:id', PesticideController.getPesticedeByIdPest);
PesticideRouter.get('/', PesticideController.getAllPesticides);

export default PesticideRouter;
