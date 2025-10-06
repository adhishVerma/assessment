import { Router } from 'express';
import { SkillController } from '../controllers/skillController';

const router = Router();
const skillController = new SkillController();

// Admin CRUD for skills
router.get('/', (req, res) => skillController.getAll(req, res));
router.post('/', (req, res) => skillController.create(req, res));
router.put('/:id', (req, res) => skillController.update(req, res));
router.delete('/:id', (req, res) => skillController.delete(req, res));

export default router;
