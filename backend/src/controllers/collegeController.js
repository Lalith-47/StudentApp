const College = require('../models/College');
const { dummyColleges } = require('../data/dummyData');

// Get all colleges
const getAllColleges = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      city, 
      state, 
      type, 
      course,
      sortBy = 'name',
      sortOrder = 'asc'
    } = req.query;

    // Build query
    const query = { isActive: true };
    if (city) query['location.city'] = { $regex: city, $options: 'i' };
    if (state) query['location.state'] = { $regex: state, $options: 'i' };
    if (type) query.type = type;
    if (course) query['courses.name'] = { $regex: course, $options: 'i' };

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Try to find in database first
    let colleges;
    try {
      const skip = (page - 1) * limit;
      colleges = await College.find(query)
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit));
    } catch (dbError) {
      console.log('Database not connected, using dummy data');
      colleges = [];
    }

    // If no data in database, use dummy data
    if (colleges.length === 0) {
      colleges = dummyColleges.filter(college => {
        if (city && !college.location.city.toLowerCase().includes(city.toLowerCase())) return false;
        if (state && !college.location.state.toLowerCase().includes(state.toLowerCase())) return false;
        if (type && college.type !== type) return false;
        if (course && !college.courses.some(c => c.name.toLowerCase().includes(course.toLowerCase()))) return false;
        return true;
      });

      // Apply sorting to dummy data
      colleges.sort((a, b) => {
        let aVal = a[sortBy];
        let bVal = b[sortBy];
        
        if (sortBy === 'location.city') {
          aVal = a.location.city;
          bVal = b.location.city;
        }
        
        if (sortOrder === 'desc') {
          return bVal > aVal ? 1 : -1;
        } else {
          return aVal > bVal ? 1 : -1;
        }
      });

      // Apply pagination
      const skip = (page - 1) * limit;
      colleges = colleges.slice(skip, skip + parseInt(limit));
    }

    res.json({
      success: true,
      data: colleges,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: colleges.length
      }
    });

  } catch (error) {
    console.error('Get all colleges error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get college by ID
const getCollegeById = async (req, res) => {
  try {
    const { id } = req.params;

    // Try to find in database first
    let college;
    try {
      college = await College.findById(id);
    } catch (dbError) {
      console.log('Database not connected, using dummy data');
      college = null;
    }

    // If not found in database, use dummy data
    if (!college) {
      college = dummyColleges.find(c => c._id === id || c.name.toLowerCase().includes(id.toLowerCase()));
      
      if (!college) {
        return res.status(404).json({
          success: false,
          message: 'College not found'
        });
      }
    }

    res.json({
      success: true,
      data: college
    });

  } catch (error) {
    console.error('Get college by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Search colleges
const searchColleges = async (req, res) => {
  try {
    const { q, limit = 10 } = req.query;
    
    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    // Try to search in database first
    let colleges;
    try {
      colleges = await College.find({
        $and: [
          { isActive: true },
          {
            $or: [
              { name: { $regex: q, $options: 'i' } },
              { 'location.city': { $regex: q, $options: 'i' } },
              { 'location.state': { $regex: q, $options: 'i' } },
              { 'courses.name': { $regex: q, $options: 'i' } }
            ]
          }
        ]
      }).limit(parseInt(limit));
    } catch (dbError) {
      console.log('Database not connected, using dummy data');
      colleges = [];
    }

    // If no data in database, search dummy data
    if (colleges.length === 0) {
      const searchTerm = q.toLowerCase();
      colleges = dummyColleges.filter(college => {
        return (
          college.name.toLowerCase().includes(searchTerm) ||
          college.location.city.toLowerCase().includes(searchTerm) ||
          college.location.state.toLowerCase().includes(searchTerm) ||
          college.courses.some(course => course.name.toLowerCase().includes(searchTerm))
        );
      });
    }

    res.json({
      success: true,
      data: colleges,
      query: q,
      results: colleges.length
    });

  } catch (error) {
    console.error('Search colleges error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Compare colleges
const compareColleges = async (req, res) => {
  try {
    const { collegeIds } = req.body;

    if (!collegeIds || !Array.isArray(collegeIds) || collegeIds.length < 2) {
      return res.status(400).json({
        success: false,
        message: 'At least two college IDs are required for comparison'
      });
    }

    if (collegeIds.length > 4) {
      return res.status(400).json({
        success: false,
        message: 'Maximum 4 colleges can be compared at once'
      });
    }

    // Try to find colleges in database first
    let colleges;
    try {
      colleges = await College.find({ 
        _id: { $in: collegeIds },
        isActive: true 
      });
    } catch (dbError) {
      console.log('Database not connected, using dummy data');
      colleges = [];
    }

    // If not found in database, use dummy data
    if (colleges.length === 0) {
      colleges = dummyColleges.filter(college => 
        collegeIds.some(id => 
          college._id === id || 
          college.name.toLowerCase().includes(id.toLowerCase())
        )
      );
    }

    if (colleges.length < 2) {
      return res.status(404).json({
        success: false,
        message: 'Insufficient colleges found for comparison'
      });
    }

    // Generate comparison data
    const comparison = {
      colleges: colleges,
      comparisonMatrix: {
        fees: colleges.map(c => ({
          name: c.name,
          annual: c.courses[0]?.fees?.annual || 'N/A',
          total: c.courses[0]?.fees?.total || 'N/A'
        })),
        placement: colleges.map(c => ({
          name: c.name,
          average: c.placement?.averagePackage || 'N/A',
          highest: c.placement?.highestPackage || 'N/A',
          percentage: c.placement?.placementPercentage || 'N/A'
        })),
        facilities: colleges.map(c => ({
          name: c.name,
          hostel: c.facilities?.hostel?.available || false,
          library: c.facilities?.library?.books || 0,
          labs: c.facilities?.labs?.length || 0
        })),
        ranking: colleges.map(c => ({
          name: c.name,
          nirf: c.accreditation?.nirf?.rank || 'N/A',
          naac: c.accreditation?.naac?.grade || 'N/A'
        }))
      },
      recommendations: generateComparisonRecommendations(colleges)
    };

    res.json({
      success: true,
      data: comparison
    });

  } catch (error) {
    console.error('Compare colleges error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get college statistics
const getCollegeStats = async (req, res) => {
  try {
    // Try to get stats from database first
    let stats;
    try {
      const totalColleges = await College.countDocuments({ isActive: true });
      const collegesByType = await College.aggregate([
        { $match: { isActive: true } },
        { $group: { _id: '$type', count: { $sum: 1 } } }
      ]);
      const collegesByState = await College.aggregate([
        { $match: { isActive: true } },
        { $group: { _id: '$location.state', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ]);

      stats = {
        totalColleges,
        collegesByType,
        topStates: collegesByState
      };
    } catch (dbError) {
      console.log('Database not connected, using dummy data');
      stats = {
        totalColleges: dummyColleges.length,
        collegesByType: [
          { _id: 'Government', count: 1 },
          { _id: 'Private', count: 0 }
        ],
        topStates: [
          { _id: 'Delhi', count: 1 }
        ]
      };
    }

    res.json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Get college stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Helper function to generate comparison recommendations
function generateComparisonRecommendations(colleges) {
  const recommendations = [];
  
  // Find best college for different criteria
  const bestPlacement = colleges.reduce((best, current) => {
    const currentPackage = parseInt(current.placement?.averagePackage?.replace(/[^\d]/g, '') || '0');
    const bestPackage = parseInt(best.placement?.averagePackage?.replace(/[^\d]/g, '') || '0');
    return currentPackage > bestPackage ? current : best;
  });

  const bestRanking = colleges.reduce((best, current) => {
    const currentRank = current.accreditation?.nirf?.rank || 999;
    const bestRank = best.accreditation?.nirf?.rank || 999;
    return currentRank < bestRank ? current : best;
  });

  recommendations.push({
    criteria: 'Best Placement',
    college: bestPlacement.name,
    reason: `Highest average package of ${bestPlacement.placement?.averagePackage}`
  });

  recommendations.push({
    criteria: 'Best Ranking',
    college: bestRanking.name,
    reason: `NIRF Rank ${bestRanking.accreditation?.nirf?.rank}`
  });

  return recommendations;
}

module.exports = {
  getAllColleges,
  getCollegeById,
  searchColleges,
  compareColleges,
  getCollegeStats
};
