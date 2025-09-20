const express = require('express');
const router = express.Router();
const { 
  getAllStories, 
  getStoryById, 
  searchStories, 
  getFeaturedStories, 
  getStoryCategories, 
  likeStory, 
  addComment 
} = require('../controllers/storyController');

// @route   GET /api/stories
// @desc    Get all stories with optional filtering
// @access  Public
router.get('/', getAllStories);

// @route   GET /api/stories/featured
// @desc    Get featured stories
// @access  Public
router.get('/featured', getFeaturedStories);

// @route   GET /api/stories/categories
// @desc    Get story categories
// @access  Public
router.get('/categories', getStoryCategories);

// @route   GET /api/stories/search
// @desc    Search stories
// @access  Public
router.get('/search', searchStories);

// @route   GET /api/stories/:id
// @desc    Get story by ID
// @access  Public
router.get('/:id', getStoryById);

// @route   POST /api/stories/:id/like
// @desc    Like a story
// @access  Public
router.post('/:id/like', likeStory);

// @route   POST /api/stories/:id/comments
// @desc    Add comment to story
// @access  Public
router.post('/:id/comments', addComment);

module.exports = router;
