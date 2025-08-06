import express from 'express';
import * as questionsController from '../controllers/questionsController.js';

const router = express.Router();

// GET /api/questions - Fetch all questions
router.get('/questions', questionsController.getAllQuestions);

// GET /api/questions/:id - Fetch single question by ID
router.get('/questions/:id', questionsController.getQuestionById);

// POST /api/add-question - Add new question
router.post('/add-question', questionsController.addQuestion);

// PUT /api/questions/:id - Edit question
router.put('/questions/:id', questionsController.updateQuestion);

// DELETE /api/questions/:id - Delete question
router.delete('/questions/:id', questionsController.deleteQuestion);

export default router;