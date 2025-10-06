import { Router } from 'express';
import { UserController } from '../controllers/userController';

const router = Router();
const userController = new UserController();

router.post('/register', (req, res) => userController.register(req, res));
router.post('/login', (req, res) => userController.login(req, res));
router.get('/profile', (req, res) => userController.profile(req, res));
router.get('/list', (req, res) => userController.listUsers(req, res));
router.get('/:id/report', (req, res) => userController.getReports(req, res));

export default router;