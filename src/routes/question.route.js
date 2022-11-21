import express from 'express';
import * as QuestionController from '../app/http/controllers/question.controller';
import isAuth from '../app/http/middlewares/auth.middleware';

const QuestionRouter = express.Router();

QuestionRouter.post('/create', isAuth, QuestionController.createQuestion);
QuestionRouter.get('/:id', QuestionController.getQuestionById);
QuestionRouter.get('/', QuestionController.getAllQuestions);

export default QuestionRouter;
