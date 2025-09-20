const express = require('express');
const router = express.Router();
const { 
  getRoadmap, 
  getAllRoadmaps, 
  searchRoadmaps, 
  getCategories 
} = require('../controllers/roadmapController');

// @route   GET /api/roadmap/:course
// @desc    Get roadmap for specific course
// @access  Public
router.get('/:course', getRoadmap);

// @route   GET /api/roadmap
// @desc    Get all roadmaps with optional filtering
// @access  Public
router.get('/', getAllRoadmaps);

// @route   GET /api/roadmap/search
// @desc    Search roadmaps
// @access  Public
router.get('/search', searchRoadmaps);

// @route   GET /api/roadmap/categories
// @desc    Get all roadmap categories
// @access  Public
router.get('/categories', getCategories);

module.exports = router;
