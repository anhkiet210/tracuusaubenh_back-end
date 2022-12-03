import * as PostController from '../app/http/controllers/post.controller';
import express from 'express';
import isAuth from '../app/http/middlewares/auth.middleware';
import isAuthAdmin from '../app/http/middlewares/authAdmin.middleware';

const PostRouter = express.Router();

PostRouter.post('/create', isAuth, PostController.createPost);
PostRouter.delete('/delete/:id', isAuth, PostController.deletePost);
PostRouter.put('/update-post/:id', isAuth, PostController.updatePost);
PostRouter.get('/get-post-by-user', isAuth, PostController.getPostByIdUser);
PostRouter.get('/get-all-post-pending', PostController.getPostPending);
PostRouter.get('/get-post-many-view', PostController.getPostManyView);
PostRouter.get('/get-post-by-id/:id', PostController.getPostById);
PostRouter.get('/get-my-post-denied', isAuth, PostController.getMyPostDenied);
PostRouter.get('/get-my-post-pending', isAuth, PostController.getMyPostPending);
PostRouter.put('/change-status-post/:id', isAuthAdmin, PostController.changeStatusPost);
PostRouter.put('/deny-post/:id', isAuthAdmin, PostController.denyPost);
PostRouter.put('/increase-views/:id', PostController.increaseViews);
PostRouter.get('/', PostController.getAllPost);

export default PostRouter;
