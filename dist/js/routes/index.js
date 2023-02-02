"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const index_1 = require("../controllers/auth/index");
const repairs_1 = require("../controllers/repairs");
const index_2 = require("../controllers/users/index");
const verifyAuthToken_1 = require("../middlewares/verifyAuthToken");
const verifyRole_1 = require("../middlewares/verifyRole");
const user_1 = require("../models/user");
const router = express_1.Router();
router.get('/', (req, res) => {
    res.status(200).json({ success: true });
});
router.post('/signUp', index_1.signUp);
router.post('/signIn', index_1.signIn);
router.get('/users', [verifyAuthToken_1.verifyAuthToken, verifyRole_1.verifyRole([user_1.Role.Manager])], index_2.getUsers);
router.get('/users/:id', [verifyAuthToken_1.verifyAuthToken, verifyRole_1.verifyRole([user_1.Role.Manager])], index_2.getUser);
router.post('/add-user', [verifyAuthToken_1.verifyAuthToken, verifyRole_1.verifyRole([user_1.Role.Manager])], index_2.addUser);
router.put('/edit-user/:id', [verifyAuthToken_1.verifyAuthToken, verifyRole_1.verifyRole([user_1.Role.Manager])], index_2.updateUser);
router.delete('/delete-user/:id', [verifyAuthToken_1.verifyAuthToken, verifyRole_1.verifyRole([user_1.Role.Manager])], index_2.deleteUser);
router.get('/repairs/:id', [verifyAuthToken_1.verifyAuthToken, verifyRole_1.verifyRole([user_1.Role.Manager])], repairs_1.getRepair);
router.get('/repairs/:id/mark', [verifyAuthToken_1.verifyAuthToken, verifyRole_1.verifyRole([user_1.Role.Manager, user_1.Role.User])], repairs_1.getMark);
router.get('/repairs', [verifyAuthToken_1.verifyAuthToken, verifyRole_1.verifyRole([user_1.Role.Manager, user_1.Role.User])], repairs_1.getRepairs);
router.post('/add-repair', [verifyAuthToken_1.verifyAuthToken, verifyRole_1.verifyRole([user_1.Role.Manager])], repairs_1.addRepair);
router.put('/edit-repair/:id', [verifyAuthToken_1.verifyAuthToken, verifyRole_1.verifyRole([user_1.Role.Manager])], repairs_1.updateRepair);
router.delete('/delete-repair/:id', [verifyAuthToken_1.verifyAuthToken, verifyRole_1.verifyRole([user_1.Role.Manager])], repairs_1.deleteRepair);
router.put('/mark-repair/:id', [verifyAuthToken_1.verifyAuthToken, verifyRole_1.verifyRole([user_1.Role.Manager, user_1.Role.User])], repairs_1.markRepair);
router.get('/availability', [verifyAuthToken_1.verifyAuthToken, verifyRole_1.verifyRole([user_1.Role.Manager])], repairs_1.checkAvailability);
router.get('/repairs/:id/comments', [verifyAuthToken_1.verifyAuthToken, verifyRole_1.verifyRole([user_1.Role.Manager, user_1.Role.User])], repairs_1.getAllComments);
router.post('/repairs/:id/comments', [verifyAuthToken_1.verifyAuthToken, verifyRole_1.verifyRole([user_1.Role.Manager, user_1.Role.User])], repairs_1.addComment);
exports.default = router;
