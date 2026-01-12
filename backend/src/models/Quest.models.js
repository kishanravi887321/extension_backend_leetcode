import mongoose from "mongoose";

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
    required: true,
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
  }
}, { timestamps: true });

// Compound unique index for preventing duplicate questions per user
QuestSchema.index({ user: 1, platform: 1, questNumber: 1 }, { unique: true });

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
