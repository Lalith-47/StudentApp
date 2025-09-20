const Roadmap = require('../models/Roadmap');
const { dummyRoadmaps } = require('../data/dummyData');

// Get roadmap for a specific course
const getRoadmap = async (req, res) => {
  try {
    const { course } = req.params;
    
    if (!course) {
      return res.status(400).json({
        success: false,
        message: 'Course parameter is required'
      });
    }

    // Try to find in database first
    let roadmap;
    try {
      roadmap = await Roadmap.findOne({ 
        courseName: { $regex: new RegExp(course, 'i') } 
      });
    } catch (dbError) {
      console.log('Database not connected, using dummy data');
      roadmap = null;
    }

    // If not found in database, use dummy data
    if (!roadmap) {
      const dummyRoadmap = dummyRoadmaps.find(rm => 
        rm.courseName.toLowerCase().includes(course.toLowerCase())
      );
      
      if (!dummyRoadmap) {
        return res.status(404).json({
          success: false,
          message: 'Roadmap not found for the specified course'
        });
      }
      
      roadmap = dummyRoadmap;
    }

    res.json({
      success: true,
      data: roadmap
    });

  } catch (error) {
    console.error('Get roadmap error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get all roadmaps
const getAllRoadmaps = async (req, res) => {
  try {
    const { category, difficulty, limit = 10, page = 1 } = req.query;
    
    // Build query
    const query = { isActive: true };
    if (category) query.category = category;
    if (difficulty) query.difficulty = difficulty;

    // Try to find in database first
    let roadmaps;
    try {
      const skip = (page - 1) * limit;
      roadmaps = await Roadmap.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit));
    } catch (dbError) {
      console.log('Database not connected, using dummy data');
      roadmaps = [];
    }

    // If no data in database, use dummy data
    if (roadmaps.length === 0) {
      roadmaps = dummyRoadmaps.filter(rm => {
        if (category && rm.category !== category) return false;
        if (difficulty && rm.difficulty !== difficulty) return false;
        return true;
      });
    }

    res.json({
      success: true,
      data: roadmaps,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: roadmaps.length
      }
    });

  } catch (error) {
    console.error('Get all roadmaps error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Search roadmaps
const searchRoadmaps = async (req, res) => {
  try {
    const { q, category, limit = 10 } = req.query;
    
    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    // Try to search in database first
    let roadmaps;
    try {
      const query = {
        $and: [
          { isActive: true },
          {
            $or: [
              { courseName: { $regex: q, $options: 'i' } },
              { description: { $regex: q, $options: 'i' } },
              { tags: { $in: [new RegExp(q, 'i')] } }
            ]
          }
        ]
      };
      
      if (category) query.$and.push({ category });
      
      roadmaps = await Roadmap.find(query)
        .sort({ 'marketDemand.current': -1 })
        .limit(parseInt(limit));
    } catch (dbError) {
      console.log('Database not connected, using dummy data');
      roadmaps = [];
    }

    // If no data in database, search dummy data
    if (roadmaps.length === 0) {
      roadmaps = dummyRoadmaps.filter(rm => {
        const searchTerm = q.toLowerCase();
        const matchesSearch = 
          rm.courseName.toLowerCase().includes(searchTerm) ||
          rm.description.toLowerCase().includes(searchTerm) ||
          rm.tags.some(tag => tag.toLowerCase().includes(searchTerm));
        
        const matchesCategory = !category || rm.category === category;
        
        return matchesSearch && matchesCategory;
      });
    }

    res.json({
      success: true,
      data: roadmaps,
      query: q,
      results: roadmaps.length
    });

  } catch (error) {
    console.error('Search roadmaps error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get roadmap categories
const getCategories = async (req, res) => {
  try {
    // Try to get from database first
    let categories;
    try {
      categories = await Roadmap.distinct('category', { isActive: true });
    } catch (dbError) {
      console.log('Database not connected, using dummy data');
      categories = [];
    }

    // If no data in database, use dummy data
    if (categories.length === 0) {
      categories = [...new Set(dummyRoadmaps.map(rm => rm.category))];
    }

    res.json({
      success: true,
      data: categories
    });

  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

module.exports = {
  getRoadmap,
  getAllRoadmaps,
  searchRoadmaps,
  getCategories
};
