import { Router } from 'express';
import { validate } from 'express-validation';
import PostsController from '../controllers/PostsController';
import Authorize from '../middleware/Authorize';
import validationRules from '../validations';

const router = Router();

router.get('/post/:id', PostsController.read);

router.get('/posts', Authorize.check, PostsController.list);
router.post(
  '/posts',
  Authorize.check,
  validate(validationRules.posts.createValidation, {}, {}),
  PostsController.create,
);
router.put(
  '/posts/:id',
  Authorize.check,
  validate(validationRules.posts.updateValidation, {}, {}),
  PostsController.update,
);
router.delete('/posts/:id', Authorize.check, PostsController.delete);

export default router;
