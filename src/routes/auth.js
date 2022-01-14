import { Router } from 'express';
import { validate } from 'express-validation';
import AuthController from '../controllers/AuthController';
import validationRules from '../validations';

const router = Router();

router.post('/signin', validate(validationRules.auth.signinValidation, {}, {}), AuthController.signin);
router.post('/signup', validate(validationRules.auth.signupValidation, {}, {}), AuthController.signup);

export default router;
