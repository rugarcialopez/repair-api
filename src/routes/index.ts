import { Router, Response, Request } from 'express';
import { signIn, signUp } from '../controllers/auth/index';
import { addRepair, deleteRepair, getRepairs, updateRepair } from '../controllers/repairs';
import { getUsers, addUser, updateUser, deleteUser } from '../controllers/users/index';
import { verifyAuthToken } from '../middlewares/verifyAuthToken';
import { verifyRole } from '../middlewares/verifyRole';
import { Role } from '../models/user';

const router: Router = Router();

router.get('/', (req: Request, res: Response): void => {
  res.status(200).json({ success: true});
});
router.post('/signUp', signUp);
router.post('/signIn', signIn);
router.get('/users',[verifyAuthToken, verifyRole([Role.Manager])], getUsers);
router.post('/add-user', [verifyAuthToken, verifyRole([Role.Manager])], addUser);
router.put('/edit-user/:id', [verifyAuthToken, verifyRole([Role.Manager])], updateUser);
router.delete('/delete-user/:id', [verifyAuthToken, verifyRole([Role.Manager])], deleteUser);
router.get('/repairs',[verifyAuthToken, verifyRole([Role.Manager])], getRepairs);
router.post('/add-repair', [verifyAuthToken, verifyRole([Role.Manager])], addRepair);
router.put('/edit-repair/:id', [verifyAuthToken, verifyRole([Role.Manager])], updateRepair);
router.delete('/delete-repair/:id', [verifyAuthToken, verifyRole([Role.Manager])], deleteRepair);
router.put('/assign-repair-user/:id', [verifyAuthToken, verifyRole([Role.Manager])], updateRepair);
router.put('/mark-repair/:id', [verifyAuthToken, verifyRole([Role.Manager, Role.User])], updateRepair);
router.put('/approve-repair/:id', [verifyAuthToken, verifyRole([Role.Manager])], updateRepair);


export default router;