import { Router } from 'express';
import { QuizController } from '../controllers/quizController';

const router = Router();
const quizController = new QuizController();

// User starts a quiz for a skill
router.post('/start/:skillId', (req, res) => quizController.startSession(req, res));

// Submit answer for a question in a quiz session
router.post('/submit/:sessionId/:questionId', (req, res) => quizController.submitAnswer(req, res));

// End a quiz session
router.post('/end/:sessionId', (req, res) => quizController.completeSession(req, res));

export default router;
