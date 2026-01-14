import mongoose from "mongoose";
import { generateUniqueId, generateQuestionId, normalizeTitle } from "../utils/uniqueId.js";

const QuestSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  platform: {
    type: String,
    enum: ["leetcode", "codeforces", "gfg", "interviewbit", "hackerrank", "codechef", "atcoder", "spoj", "other"],
    required: true,
  },
  // Unique identifier: platform + (questNumber|normalizedTitle) + userId
  uniqueId: {
    type: String,
    unique: true,
    index: true,
  },
  // Question identifier (without user): platform + (questNumber|normalizedTitle)
  questionId: {
    type: String,
    index: true,
  },
  difficulty: {
    type: String,
    enum: ["easy", "medium", "hard"],
    default: "medium",
  },
  notes: {
    type: String,
    default: "",
  },
  lastRevisedAt: {
    type: Date,
    default: null,
  },
  bookmarked: {
    type: Boolean,
    default: false,
  },
  questNumber: {
    type: String,
    // required: true,
  },
  questLink: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['solved', 'unsolved', 'for-future'],
    default: 'unsolved',
  },
  topics: {
    type: [String],
    default: [],
    index: true,
  },
  questName: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: "",
  },
  companyTags: {
    type: [String],
    default: [],
  }
}, { timestamps: true });

// Pre-save middleware to generate uniqueId and questionId
QuestSchema.pre('save', function(next) {
  try {
    const platform = this.platform.toLowerCase();
    
    // Generate unique ID based on platform type
    this.uniqueId = generateUniqueId({
      platform: this.platform,
      questNumber: this.questNumber,
      questName: this.questName,
      userId: this.user.toString()
    });
    
    // Generate question ID (without user component)
    this.questionId = generateQuestionId({
      platform: this.platform,
      questNumber: this.questNumber,
      questName: this.questName
    });
    
    next();
  } catch (error) {
    next(error);
  }
});

// Pre findOneAndUpdate middleware to generate uniqueId
QuestSchema.pre('findOneAndUpdate', function() {
  const update = this.getUpdate();
  const filter = this.getFilter();
  
  // Get the values from update or filter
  const platform = update.$set?.platform || filter.platform;
  const questNumber = update.$set?.questNumber || update.$setOnInsert?.questNumber || filter.questNumber;
  const questName = update.$set?.questName || filter.questName;
  const userId = filter.user?.toString();
  
  if (platform && userId) {
    try {
      const uniqueId = generateUniqueId({
        platform,
        questNumber,
        questName,
        userId
      });
      
      const questionId = generateQuestionId({
        platform,
        questNumber,
        questName
      });
      
      // Set uniqueId and questionId in the update
      if (!update.$set) update.$set = {};
      update.$set.uniqueId = uniqueId;
      update.$set.questionId = questionId;
      
      if (update.$setOnInsert) {
        update.$setOnInsert.uniqueId = uniqueId;
        update.$setOnInsert.questionId = questionId;
      }
    } catch (error) {
      // If unique ID generation fails, let the operation continue
      // The validation will catch missing required fields
      console.warn('UniqueId generation warning:', error.message);
    }
  }
});

// Unique index on uniqueId (primary deduplication mechanism)
QuestSchema.index({ uniqueId: 1 }, { unique: true, sparse: true });

// Index for finding same question across users
QuestSchema.index({ questionId: 1 });

// Compound unique index for backward compatibility
QuestSchema.index({ user: 1, platform: 1, questNumber: 1 }, { unique: true, sparse: true });

// Text index for fast search on questName and questNumber
QuestSchema.index({ questName: 'text', questNumber: 'text', description: 'text' });

// Index for filtering and sorting
QuestSchema.index({ user: 1, status: 1 });
QuestSchema.index({ user: 1, difficulty: 1 });
QuestSchema.index({ user: 1, platform: 1 });
QuestSchema.index({ user: 1, bookmarked: 1 });
QuestSchema.index({ user: 1, lastRevisedAt: -1 });
QuestSchema.index({ user: 1, createdAt: -1 });

const Quest = mongoose.model('Quest', QuestSchema);
export default Quest;
