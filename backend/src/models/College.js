const mongoose = require('mongoose');

const collegeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  shortName: {
    type: String,
    trim: true
  },
  type: {
    type: String,
    enum: ['Public', 'Private', 'Government', 'Deemed University', 'Autonomous'],
    required: true
  },
  location: {
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, default: 'India' },
    pincode: String,
    address: String
  },
  contact: {
    phone: [String],
    email: [String],
    website: String,
    admissionEmail: String
  },
  established: {
    type: Number,
    required: true
  },
  accreditation: {
    naac: {
      grade: String,
      score: Number
    },
    nirf: {
      rank: Number,
      year: Number
    },
    other: [String]
  },
  courses: [{
    name: String,
    level: {
      type: String,
      enum: ['Diploma', 'UG', 'PG', 'PhD', 'Certificate']
    },
    duration: String,
    fees: {
      annual: String,
      total: String
    },
    seats: Number,
    eligibility: String,
    entranceExam: [String]
  }],
  facilities: {
    hostel: {
      available: Boolean,
      capacity: Number,
      fees: String
    },
    library: {
      books: Number,
      digital: Boolean
    },
    labs: [String],
    sports: [String],
    other: [String]
  },
  faculty: {
    total: Number,
    phd: Number,
    studentRatio: String
  },
  placement: {
    averagePackage: String,
    highestPackage: String,
    placementPercentage: Number,
    topRecruiters: [String],
    year: Number
  },
  admission: {
    process: String,
    importantDates: [{
      event: String,
      date: Date
    }],
    documents: [String],
    fees: {
      application: String,
      registration: String
    }
  },
  reviews: [{
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: String,
    category: {
      type: String,
      enum: ['Academics', 'Infrastructure', 'Faculty', 'Placement', 'Hostel', 'Overall']
    },
    author: String,
    date: {
      type: Date,
      default: Date.now
    }
  }],
  images: [String],
  socialMedia: {
    facebook: String,
    twitter: String,
    instagram: String,
    linkedin: String
  },
  isActive: {
    type: Boolean,
    default: true
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
collegeSchema.index({ name: 1 });
collegeSchema.index({ 'location.city': 1, 'location.state': 1 });
collegeSchema.index({ type: 1 });
collegeSchema.index({ 'accreditation.nirf.rank': 1 });
collegeSchema.index({ 'courses.name': 1 });

// Virtual for average rating
collegeSchema.virtual('averageRating').get(function() {
  if (this.reviews.length === 0) return 0;
  const sum = this.reviews.reduce((acc, review) => acc + review.rating, 0);
  return (sum / this.reviews.length).toFixed(1);
});

// Ensure virtual fields are serialized
collegeSchema.set('toJSON', { virtuals: true });

// Update timestamp on save
collegeSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('College', collegeSchema);
