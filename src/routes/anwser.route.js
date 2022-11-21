import * as AnwserController from '../app/http/controllers/answer.controller';
import express from 'express';
import isAuth from '../app/http/middlewares/auth.middleware';

const AnwserRouter = express.Router();

AnwserRouter.post('/create', isAuth, AnwserController.createAnwser);
AnwserRouter.get('/get-answer-by-id-question/:id', AnwserController.getAnwserByIdQuestion);

export default AnwserRouter;
