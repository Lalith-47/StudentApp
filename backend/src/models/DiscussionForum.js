const mongoose = require("mongoose");

const discussionForumSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: [200, "Title cannot exceed 200 characters"],
  },
  description: {
    type: String,
    trim: true,
    maxlength: [1000, "Description cannot exceed 1000 characters"],
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  type: {
    type: String,
    enum: [
      "general",
      "assignment",
      "project",
      "announcement",
      "qa",
      "study-group",
    ],
    default: "general",
  },
  isPinned: {
    type: Boolean,
    default: false,
  },
  isLocked: {
    type: Boolean,
    default: false,
  },
  isAnonymous: {
    type: Boolean,
    default: false,
  },
  tags: [String],
  posts: [
    {
      authorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      content: {
        type: String,
        required: true,
        trim: true,
        maxlength: [5000, "Post content cannot exceed 5000 characters"],
      },
      isOriginalPost: {
        type: Boolean,
        default: false,
      },
      parentPostId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "posts",
      },
      attachments: [
        {
          filename: String,
          originalName: String,
          url: String,
          size: Number,
          mimeType: String,
          uploadedAt: {
            type: Date,
            default: Date.now,
          },
        },
      ],
      reactions: [
        {
          userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
          },
          type: {
            type: String,
            enum: ["like", "dislike", "love", "laugh", "angry", "sad"],
          },
          createdAt: {
            type: Date,
            default: Date.now,
          },
        },
      ],
      replies: [
        {
          authorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
          },
          content: {
            type: String,
            required: true,
            trim: true,
            maxlength: [2000, "Reply content cannot exceed 2000 characters"],
          },
          createdAt: {
            type: Date,
            default: Date.now,
          },
          updatedAt: Date,
          isEdited: {
            type: Boolean,
            default: false,
          },
          reactions: [
            {
              userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
              },
              type: {
                type: String,
                enum: ["like", "dislike", "love", "laugh", "angry", "sad"],
              },
              createdAt: {
                type: Date,
                default: Date.now,
              },
            },
          ],
        },
      ],
      createdAt: {
        type: Date,
        default: Date.now,
      },
      updatedAt: Date,
      isEdited: {
        type: Boolean,
        default: false,
      },
      isDeleted: {
        type: Boolean,
        default: false,
      },
    },
  ],
  participants: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      joinedAt: {
        type: Date,
        default: Date.now,
      },
      role: {
        type: String,
        enum: ["student", "faculty", "moderator"],
        default: "student",
      },
      notificationSettings: {
        newPosts: { type: Boolean, default: true },
        replies: { type: Boolean, default: true },
        mentions: { type: Boolean, default: true },
      },
    },
  ],
  analytics: {
    totalPosts: { type: Number, default: 0 },
    totalReplies: { type: Number, default: 0 },
    totalParticipants: { type: Number, default: 0 },
    totalViews: { type: Number, default: 0 },
    lastActivity: Date,
    averageResponseTime: Number, // in hours
  },
  settings: {
    allowAnonymousPosts: { type: Boolean, default: false },
    requireApproval: { type: Boolean, default: false },
    maxAttachmentsPerPost: { type: Number, default: 5 },
    maxAttachmentSize: { type: Number, default: 10 * 1024 * 1024 }, // 10MB
    moderationLevel: {
      type: String,
      enum: ["none", "basic", "strict"],
      default: "basic",
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Indexes for better performance
discussionForumSchema.index({ courseId: 1, createdAt: -1 });
discussionForumSchema.index({ createdBy: 1 });
discussionForumSchema.index({ type: 1 });
discussionForumSchema.index({ isPinned: -1, createdAt: -1 });
discussionForumSchema.index({ "posts.authorId": 1 });
discussionForumSchema.index({ "posts.createdAt": -1 });
discussionForumSchema.index({ tags: 1 });

// Update timestamp on save
discussionForumSchema.pre("save", function (next) {
  this.updatedAt = Date.now();

  // Update analytics
  this.analytics.totalPosts = this.posts.filter(
    (post) => !post.isDeleted
  ).length;
  this.analytics.totalReplies = this.posts.reduce(
    (total, post) => total + post.replies.length,
    0
  );
  this.analytics.totalParticipants = this.participants.length;

  // Update last activity
  if (this.posts.length > 0) {
    const lastPost = this.posts[this.posts.length - 1];
    this.analytics.lastActivity = lastPost.createdAt;
  }

  next();
});

// Method to add post
discussionForumSchema.methods.addPost = function (
  authorId,
  content,
  attachments = []
) {
  const post = {
    authorId,
    content,
    attachments,
    isOriginalPost: this.posts.length === 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  this.posts.push(post);

  // Add participant if not already present
  const existingParticipant = this.participants.find(
    (p) => p.userId.toString() === authorId.toString()
  );

  if (!existingParticipant) {
    this.participants.push({
      userId: authorId,
      joinedAt: new Date(),
      role: "student",
    });
  }

  return this.save();
};

// Method to add reply
discussionForumSchema.methods.addReply = function (postId, authorId, content) {
  const post = this.posts.id(postId);

  if (post) {
    post.replies.push({
      authorId,
      content,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    post.updatedAt = new Date();

    // Add participant if not already present
    const existingParticipant = this.participants.find(
      (p) => p.userId.toString() === authorId.toString()
    );

    if (!existingParticipant) {
      this.participants.push({
        userId: authorId,
        joinedAt: new Date(),
        role: "student",
      });
    }
  }

  return this.save();
};

// Method to add reaction
discussionForumSchema.methods.addReaction = function (
  postId,
  userId,
  reactionType
) {
  const post = this.posts.id(postId);

  if (post) {
    // Remove existing reaction from this user
    post.reactions = post.reactions.filter(
      (reaction) => reaction.userId.toString() !== userId.toString()
    );

    // Add new reaction
    post.reactions.push({
      userId,
      type: reactionType,
      createdAt: new Date(),
    });
  }

  return this.save();
};

// Method to join discussion
discussionForumSchema.methods.joinDiscussion = function (
  userId,
  role = "student"
) {
  const existingParticipant = this.participants.find(
    (p) => p.userId.toString() === userId.toString()
  );

  if (!existingParticipant) {
    this.participants.push({
      userId,
      joinedAt: new Date(),
      role,
    });
  }

  return this.save();
};

// Static method to get course discussions
discussionForumSchema.statics.getCourseDiscussions = function (
  courseId,
  type = null,
  limit = 20
) {
  const filter = { courseId };
  if (type) filter.type = type;

  return this.find(filter)
    .populate("createdBy", "name email")
    .populate("posts.authorId", "name email")
    .populate("posts.replies.authorId", "name email")
    .sort({ isPinned: -1, createdAt: -1 })
    .limit(limit);
};

// Static method to get user discussions
discussionForumSchema.statics.getUserDiscussions = function (userId) {
  return this.find({
    $or: [{ createdBy: userId }, { "participants.userId": userId }],
  })
    .populate("courseId", "title code")
    .sort({ updatedAt: -1 });
};

// Static method to search discussions
discussionForumSchema.statics.searchDiscussions = function (
  query,
  courseId = null
) {
  const searchFilter = {
    $or: [
      { title: { $regex: query, $options: "i" } },
      { description: { $regex: query, $options: "i" } },
      { tags: { $in: [new RegExp(query, "i")] } },
      { "posts.content": { $regex: query, $options: "i" } },
    ],
  };

  if (courseId) {
    searchFilter.courseId = courseId;
  }

  return this.find(searchFilter)
    .populate("createdBy", "name email")
    .populate("courseId", "title code")
    .sort({ updatedAt: -1 });
};

module.exports = mongoose.model("DiscussionForum", discussionForumSchema);

