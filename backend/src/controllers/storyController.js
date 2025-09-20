const Story = require('../models/Story');
const { dummyStories } = require('../data/dummyData');

// Get all stories
const getAllStories = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      category, 
      featured, 
      sortBy = 'publishedAt',
      sortOrder = 'desc'
    } = req.query;

    // Build query
    const query = { isActive: true, isApproved: true };
    if (category) query.category = category;
    if (featured === 'true') query.isFeatured = true;

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Try to find in database first
    let stories;
    try {
      const skip = (page - 1) * limit;
      stories = await Story.find(query)
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit));
    } catch (dbError) {
      console.log('Database not connected, using dummy data');
      stories = [];
    }

    // If no data in database, use dummy data
    if (stories.length === 0) {
      stories = dummyStories.filter(story => {
        if (category && story.category !== category) return false;
        if (featured === 'true' && !story.isFeatured) return false;
        return true;
      });

      // Apply sorting to dummy data
      stories.sort((a, b) => {
        let aVal = a[sortBy];
        let bVal = b[sortBy];
        
        if (sortOrder === 'desc') {
          return bVal > aVal ? 1 : -1;
        } else {
          return aVal > bVal ? 1 : -1;
        }
      });

      // Apply pagination
      const skip = (page - 1) * limit;
      stories = stories.slice(skip, skip + parseInt(limit));
    }

    res.json({
      success: true,
      data: stories,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: stories.length
      }
    });

  } catch (error) {
    console.error('Get all stories error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get story by ID
const getStoryById = async (req, res) => {
  try {
    const { id } = req.params;

    // Try to find in database first
    let story;
    try {
      story = await Story.findById(id);
      if (story) {
        // Increment view count
        await story.incrementViews();
      }
    } catch (dbError) {
      console.log('Database not connected, using dummy data');
      story = null;
    }

    // If not found in database, use dummy data
    if (!story) {
      story = dummyStories.find(s => s._id === id || s.title.toLowerCase().includes(id.toLowerCase()));
      
      if (!story) {
        return res.status(404).json({
          success: false,
          message: 'Story not found'
        });
      }
    }

    res.json({
      success: true,
      data: story
    });

  } catch (error) {
    console.error('Get story by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Search stories
const searchStories = async (req, res) => {
  try {
    const { q, category, limit = 10 } = req.query;
    
    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    // Try to search in database first
    let stories;
    try {
      const query = {
        $and: [
          { isActive: true, isApproved: true },
          {
            $or: [
              { title: { $regex: q, $options: 'i' } },
              { content: { $regex: q, $options: 'i' } },
              { summary: { $regex: q, $options: 'i' } },
              { tags: { $in: [new RegExp(q, 'i')] } }
            ]
          }
        ]
      };
      
      if (category) query.$and.push({ category });
      
      stories = await Story.find(query)
        .sort({ publishedAt: -1 })
        .limit(parseInt(limit));
    } catch (dbError) {
      console.log('Database not connected, using dummy data');
      stories = [];
    }

    // If no data in database, search dummy data
    if (stories.length === 0) {
      const searchTerm = q.toLowerCase();
      stories = dummyStories.filter(story => {
        const matchesSearch = 
          story.title.toLowerCase().includes(searchTerm) ||
          story.content.toLowerCase().includes(searchTerm) ||
          story.summary.toLowerCase().includes(searchTerm) ||
          story.tags.some(tag => tag.toLowerCase().includes(searchTerm));
        
        const matchesCategory = !category || story.category === category;
        
        return matchesSearch && matchesCategory;
      });
    }

    res.json({
      success: true,
      data: stories,
      query: q,
      results: stories.length
    });

  } catch (error) {
    console.error('Search stories error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get featured stories
const getFeaturedStories = async (req, res) => {
  try {
    const { limit = 5 } = req.query;

    // Try to find in database first
    let stories;
    try {
      stories = await Story.find({ 
        isActive: true, 
        isApproved: true, 
        isFeatured: true 
      })
      .sort({ publishedAt: -1 })
      .limit(parseInt(limit));
    } catch (dbError) {
      console.log('Database not connected, using dummy data');
      stories = [];
    }

    // If no data in database, use dummy data
    if (stories.length === 0) {
      stories = dummyStories
        .filter(story => story.isFeatured)
        .slice(0, parseInt(limit));
    }

    res.json({
      success: true,
      data: stories
    });

  } catch (error) {
    console.error('Get featured stories error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get story categories
const getStoryCategories = async (req, res) => {
  try {
    // Try to get from database first
    let categories;
    try {
      categories = await Story.distinct('category', { isActive: true, isApproved: true });
    } catch (dbError) {
      console.log('Database not connected, using dummy data');
      categories = [];
    }

    // If no data in database, use dummy data
    if (categories.length === 0) {
      categories = [...new Set(dummyStories.map(story => story.category))];
    }

    res.json({
      success: true,
      data: categories
    });

  } catch (error) {
    console.error('Get story categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Like a story
const likeStory = async (req, res) => {
  try {
    const { id } = req.params;

    // Try to find in database first
    let story;
    try {
      story = await Story.findById(id);
      if (story) {
        await story.addLike();
      }
    } catch (dbError) {
      console.log('Database not connected, using dummy data');
      story = null;
    }

    // If not found in database, use dummy data
    if (!story) {
      story = dummyStories.find(s => s._id === id);
      
      if (!story) {
        return res.status(404).json({
          success: false,
          message: 'Story not found'
        });
      }
      
      // Simulate like increment
      story.likes += 1;
    }

    res.json({
      success: true,
      message: 'Story liked successfully',
      data: { likes: story.likes }
    });

  } catch (error) {
    console.error('Like story error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Add comment to story
const addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { author, content } = req.body;

    if (!author || !content) {
      return res.status(400).json({
        success: false,
        message: 'Author and content are required'
      });
    }

    // Try to find in database first
    let story;
    try {
      story = await Story.findById(id);
      if (story) {
        story.comments.push({
          author,
          content,
          date: new Date(),
          likes: 0
        });
        await story.save();
      }
    } catch (dbError) {
      console.log('Database not connected, using dummy data');
      story = null;
    }

    // If not found in database, use dummy data
    if (!story) {
      story = dummyStories.find(s => s._id === id);
      
      if (!story) {
        return res.status(404).json({
          success: false,
          message: 'Story not found'
        });
      }
      
      // Simulate comment addition
      story.comments.push({
        author,
        content,
        date: new Date(),
        likes: 0
      });
    }

    res.json({
      success: true,
      message: 'Comment added successfully',
      data: story.comments
    });

  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

module.exports = {
  getAllStories,
  getStoryById,
  searchStories,
  getFeaturedStories,
  getStoryCategories,
  likeStory,
  addComment
};
