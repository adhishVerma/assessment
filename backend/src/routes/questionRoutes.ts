import { Router } from 'express';
import { QuestionController } from '../controllers/questionController';

const router = Router();
const questionController = new QuestionController();

// List questions (optionally filter by skill)
router.get('/', (req, res) => questionController.list(req, res));

// Admin CRUD for questions
router.post('/', (req, res) => questionController.create(req, res));
router.put('/:id', (req, res) => questionController.update(req, res));
router.delete('/:id', (req, res) => questionController.delete(req, res));

export default router;
