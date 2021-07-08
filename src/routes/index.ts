import { Router, Response, Request } from 'express';
import { signIn, signUp } from '../controllers/auth/index';
import { addRepair, deleteRepair, getRepair, getRepairs, updateRepair, checkAvailability, markRepair } from '../controllers/repairs';
import { getUsers, getUser, addUser, updateUser, deleteUser } from '../controllers/users/index';
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
router.get('/users/:id',[verifyAuthToken, verifyRole([Role.Manager])], getUser);
router.post('/add-user', [verifyAuthToken, verifyRole([Role.Manager])], addUser);
router.put('/edit-user/:id', [verifyAuthToken, verifyRole([Role.Manager])], updateUser);
router.delete('/delete-user/:id', [verifyAuthToken, verifyRole([Role.Manager])], deleteUser);
router.get('/repairs/:id',[verifyAuthToken, verifyRole([Role.Manager])], getRepair);
router.get('/repairs',[verifyAuthToken, verifyRole([Role.Manager, Role.User])], getRepairs);
router.post('/add-repair', [verifyAuthToken, verifyRole([Role.Manager])], addRepair);
router.put('/edit-repair/:id', [verifyAuthToken, verifyRole([Role.Manager])], updateRepair);
router.delete('/delete-repair/:id', [verifyAuthToken, verifyRole([Role.Manager])], deleteRepair);
router.put('/mark-repair/:id', [verifyAuthToken, verifyRole([Role.Manager, Role.User])], markRepair);
router.get('/availability',[verifyAuthToken, verifyRole([Role.Manager])], checkAvailability);


export default router;