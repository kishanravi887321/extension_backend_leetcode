const QuestSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: User,
    required: true,
  },
  platform: {
    type: String,
    enum: ["leetcode", "codeforces", "gfg", "interviewbit", "hackerrank"],
    required: true,
  },
  difficulty: {
    type: String,
    enum: ["easy", "medium", "hard"],
  },
  notes: String,
  lastRevisedAt: Date,
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
  topics: [String],
  questName: {
    type: String,
    required: true,
  },
  description: String,
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

// Compound unique index
QuestSchema.index({ user: 1, platform: 1, questNumber: 1 }, { unique: true });

const Quest = mongoose.model('Quest', QuestSchema);
export default Quest;
