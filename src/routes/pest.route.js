import * as PestController from '../app/http/controllers/pest.controller';
import express from 'express';
import isAuthAdmin from '../app/http/middlewares/authAdmin.middleware';

const PestRouter = express.Router();

PestRouter.post('/create', isAuthAdmin, PestController.createPest);
PestRouter.put('/update/:id', isAuthAdmin, PestController.updatePest);
PestRouter.get('/get-pest-by-id/:id', PestController.getPestById);
PestRouter.post('/detect-pest', PestController.detectPest);
PestRouter.get('/', PestController.getAllPests);

export default PestRouter;
