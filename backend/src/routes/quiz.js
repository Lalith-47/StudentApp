const express = require('express');
const router = express.Router();
const { submitQuiz, getQuizResults } = require('../controllers/quizController');

// @route   POST /api/quiz
// @desc    Submit quiz results
// @access  Public
router.post('/', submitQuiz);

// @route   GET /api/quiz/results
// @desc    Get quiz results for authenticated user
// @access  Private
router.get('/results', getQuizResults);

module.exports = router;
