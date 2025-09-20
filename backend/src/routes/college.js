const express = require('express');
const router = express.Router();
const { 
  getAllColleges, 
  getCollegeById, 
  searchColleges, 
  compareColleges, 
  getCollegeStats 
} = require('../controllers/collegeController');

// @route   GET /api/colleges
// @desc    Get all colleges with optional filtering
// @access  Public
router.get('/', getAllColleges);

// @route   GET /api/colleges/search
// @desc    Search colleges
// @access  Public
router.get('/search', searchColleges);

// @route   GET /api/colleges/stats
// @desc    Get college statistics
// @access  Public
router.get('/stats', getCollegeStats);

// @route   GET /api/colleges/:id
// @desc    Get college by ID
// @access  Public
router.get('/:id', getCollegeById);

// @route   POST /api/colleges/compare
// @desc    Compare multiple colleges
// @access  Public
router.post('/compare', compareColleges);

module.exports = router;
