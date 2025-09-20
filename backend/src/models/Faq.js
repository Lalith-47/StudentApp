const mongoose = require('mongoose');

const faqSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  answer: {
    type: String,
    required: true,
    minlength: [20, 'Answer must be at least 20 characters']
  },
  category: {
    type: String,
    required: true,
    enum: [
      'General',
      'Admissions',
      'Courses',
      'Career Guidance',
      'Scholarships',
      'Placements',
      'Technical',
      'Account',
      'Payment'
    ]
  },
  subcategory: String,
  tags: [String],
  priority: {
    type: Number,
    default: 0,
    min: 0,
    max: 10
  },
  relatedQuestions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Faq'
  }],
  helpful: {
    yes: { type: Number, default: 0 },
    no: { type: Number, default: 0 }
  },
  views: {
    type: Number,
    default: 0
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: String,
    default: 'System'
  },
  updatedBy: {
    type: String,
    default: 'System'
  }
});

// Indexes for efficient queries
faqSchema.index({ category: 1, priority: -1 });
faqSchema.index({ tags: 1 });
faqSchema.index({ isActive: 1 });
faqSchema.index({ views: -1 });

// Text search index
faqSchema.index({
  question: 'text',
  answer: 'text',
  tags: 'text'
});

// Virtual for helpful percentage
faqSchema.virtual('helpfulPercentage').get(function() {
  const total = this.helpful.yes + this.helpful.no;
  if (total === 0) return 0;
  return Math.round((this.helpful.yes / total) * 100);
});

// Ensure virtual fields are serialized
faqSchema.set('toJSON', { virtuals: true });

// Update timestamp on save
faqSchema.pre('save', function(next) {
  this.lastUpdated = Date.now();
  next();
});

// Increment view count
faqSchema.methods.incrementViews = function() {
  this.views += 1;
  return this.save();
};

// Mark as helpful
faqSchema.methods.markHelpful = function(isHelpful) {
  if (isHelpful) {
    this.helpful.yes += 1;
  } else {
    this.helpful.no += 1;
  }
  return this.save();
};

module.exports = mongoose.model('Faq', faqSchema);
