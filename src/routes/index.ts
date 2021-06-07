import { Router } from 'express';
import { signIn, signUp } from '../controllers/auth/index';

const router: Router = Router();

router.post('/signUp', signUp);
router.post('/signIn', signIn);

export default router;