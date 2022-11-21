import * as CropController from '../app/http/controllers/crop.controller';
import express from 'express';
import isAuthAdmin from '../app/http/middlewares/authAdmin.middleware';

const CropRouter = express.Router();

CropRouter.post('/create', isAuthAdmin, CropController.createCrop);
CropRouter.get('/:id', CropController.getCropById);
CropRouter.put('/update/:id', isAuthAdmin, CropController.updateCrop);
CropRouter.delete('/:id', isAuthAdmin, CropController.deleteCropById);
CropRouter.get('/', CropController.getAllCrop);

export default CropRouter;
