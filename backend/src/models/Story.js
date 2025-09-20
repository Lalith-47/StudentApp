const mongoose = require('mongoose');

const storySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: [200, 'Title cannot be more than 200 characters']
  },
  author: {
    name: {
      type: String,
      required: true,
      trim: true
    },
    currentRole: String,
    company: String,
    experience: String,
    profileImage: String,
    socialLinks: {
      linkedin: String,
      twitter: String,
      website: String
    }
  },
  content: {
    type: String,
    required: true,
    minlength: [100, 'Story content must be at least 100 characters']
  },
  summary: {
    type: String,
    required: true,
    maxlength: [500, 'Summary cannot be more than 500 characters']
  },
  category: {
    type: String,
    required: true,
    enum: ['Success Story', 'Career Change', 'Entrepreneurship', 'Academic Journey', 'Industry Insights', 'Challenges Overcome']
  },
  tags: [String],
  course: {
    name: String,
    college: String,
    year: Number
  },
  careerPath: {
    from: String,
    to: String,
    timeline: String
  },
  keyAchievements: [String],
  challenges: [String],
  advice: [String],
  images: [String],
  videoUrl: String,
  readTime: {
    type: Number, // in minutes
    default: 5
  },
  likes: {
    type: Number,
    default: 0
  },
  views: {
    type: Number,
    default: 0
  },
  comments: [{
    author: String,
    content: String,
    date: {
      type: Date,
      default: Date.now
    },
    likes: {
      type: Number,
      default: 0
    }
  }],
  isFeatured: {
    type: Boolean,
    default: false
  },
  isApproved: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  publishedAt: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Indexes for efficient queries
storySchema.index({ category: 1 });
storySchema.index({ tags: 1 });
storySchema.index({ isFeatured: 1, isApproved: 1 });
storySchema.index({ publishedAt: -1 });
storySchema.index({ likes: -1 });
storySchema.index({ views: -1 });

// Text search index
storySchema.index({
  title: 'text',
  content: 'text',
  summary: 'text',
  tags: 'text'
});

// Update timestamp on save
storySchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Increment view count
storySchema.methods.incrementViews = function() {
  this.views += 1;
  return this.save();
};

// Add like
storySchema.methods.addLike = function() {
  this.likes += 1;
  return this.save();
};

// Remove like
storySchema.methods.removeLike = function() {
  if (this.likes > 0) {
    this.likes -= 1;
  }
  return this.save();
};

module.exports = mongoose.model('Story', storySchema);
