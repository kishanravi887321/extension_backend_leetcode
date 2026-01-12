import Quest from "../models/Quest.models.js";
import mongoose from "mongoose";

// @desc    Upsert a question (create or update based on questNumber + platform + user)
// @route   POST /api/quests/upsert
// @access  Private
export const upsertQuest = async (req, res) => {
  try {
    const { questName, questNumber, questLink, platform, difficulty, topics, status, notes, description, bookmarked } = req.body;

    // Validate required fields
    if (!questName || !questNumber || !questLink || !platform) {
      return res.status(400).json({
        success: false,
        message: "Please provide questName, questNumber, questLink, and platform"
      });
    }

    // Build update object with only provided fields
    const updateData = {
      questName,
      questLink,
      platform,
    };

    // Only include optional fields if they are provided
    if (difficulty !== undefined) updateData.difficulty = difficulty;
    if (topics !== undefined) updateData.topics = topics;
    if (status !== undefined) updateData.status = status;
    if (notes !== undefined) updateData.notes = notes;
    if (description !== undefined) updateData.description = description;
    if (bookmarked !== undefined) updateData.bookmarked = bookmarked;

    // Find and update, or create if not exists
    const quest = await Quest.findOneAndUpdate(
      {
        user: req.user.id,
        questNumber: questNumber,
        platform: platform
      },
      {
        $set: updateData,
        $setOnInsert: {
          user: req.user.id,
          questNumber: questNumber,
          createdAt: new Date()
        }
      },
      {
        new: true,           // Return the modified document
        upsert: true,        // Create if not found
        runValidators: true  // Run schema validators
      }
    );

    // Check if it was an insert or update by comparing timestamps
    const isNew = quest.createdAt.getTime() === quest.updatedAt.getTime();

    res.status(isNew ? 201 : 200).json({
      success: true,
      message: isNew ? "Question created successfully" : "Question updated successfully",
      isNew,
      quest
    });
  } catch (error) {
    console.error("Upsert quest error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while upserting question"
    });
  }
};

// @desc    Create a new question
// @route   POST /api/quests
// @access  Private
export const createQuest = async (req, res) => {
  try {
    const { questName, questNumber, questLink, platform, difficulty, topics, status, notes, description } = req.body;

    if (!questName || !questNumber || !questLink || !platform) {
      return res.status(400).json({
        success: false,
        message: "Please provide questName, questNumber, questLink, and platform"
      });
    }

    const quest = await Quest.create({
      user: req.user.id,
      questName,
      questNumber,
      questLink,
      platform,
      difficulty: difficulty || "medium",
      topics: topics || [],
      status: status || "unsolved",
      notes: notes || "",
      description: description || ""
    });

    res.status(201).json({
      success: true,
      message: "Question created successfully",
      quest
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "This question already exists in your collection"
      });
    }
    console.error("Create quest error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while creating question"
    });
  }
};

// @desc    Get all questions with filters, search, and pagination
// @route   GET /api/quests
// @access  Private
export const getQuests = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      status,
      difficulty,
      platform,
      topics,
      bookmarked,
      search,
      searchBy,
      sortBy = "createdAt",
      sortOrder = "desc"
    } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Build query
    const query = { user: req.user.id };

    // Status filter
    if (status && status !== "all") {
      query.status = status;
    }

    // Difficulty filter
    if (difficulty && difficulty !== "all") {
      if (Array.isArray(difficulty)) {
        query.difficulty = { $in: difficulty };
      } else {
        query.difficulty = difficulty;
      }
    }

    // Platform filter
    if (platform && platform !== "all") {
      if (Array.isArray(platform)) {
        query.platform = { $in: platform };
      } else {
        query.platform = platform;
      }
    }

    // Topics filter (match any topic)
    if (topics) {
      const topicsArray = Array.isArray(topics) ? topics : topics.split(",");
      query.topics = { $in: topicsArray };
    }

    // Bookmarked filter
    if (bookmarked === "true") {
      query.bookmarked = true;
    }

    // Search functionality
    if (search && search.trim()) {
      const searchTerm = search.trim();
      
      if (searchBy === "number") {
        // Search by question number
        query.questNumber = { $regex: searchTerm, $options: "i" };
      } else if (searchBy === "name") {
        // Search by question name
        query.questName = { $regex: searchTerm, $options: "i" };
      } else {
        // Search both name and number (default)
        query.$or = [
          { questName: { $regex: searchTerm, $options: "i" } },
          { questNumber: { $regex: searchTerm, $options: "i" } },
          { description: { $regex: searchTerm, $options: "i" } }
        ];
      }
    }

    // Build sort object
    const sortOptions = {};
    const validSortFields = ["createdAt", "updatedAt", "lastRevisedAt", "difficulty", "questNumber", "questName"];
    
    if (validSortFields.includes(sortBy)) {
      if (sortBy === "difficulty") {
        // Custom sort for difficulty: easy -> medium -> hard
        sortOptions.difficulty = sortOrder === "asc" ? 1 : -1;
      } else {
        sortOptions[sortBy] = sortOrder === "asc" ? 1 : -1;
      }
    } else {
      sortOptions.createdAt = -1;
    }

    // Execute query with pagination
    const [quests, totalCount] = await Promise.all([
      Quest.find(query)
        .sort(sortOptions)
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Quest.countDocuments(query)
    ]);

    const totalPages = Math.ceil(totalCount / limitNum);

    res.json({
      success: true,
      quests,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalCount,
        limit: limitNum,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1
      }
    });
  } catch (error) {
    console.error("Get quests error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching questions"
    });
  }
};

// @desc    Get single question by ID
// @route   GET /api/quests/:id
// @access  Private
export const getQuestById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid question ID"
      });
    }

    const quest = await Quest.findOne({ _id: id, user: req.user.id });

    if (!quest) {
      return res.status(404).json({
        success: false,
        message: "Question not found"
      });
    }

    res.json({
      success: true,
      quest
    });
  } catch (error) {
    console.error("Get quest by ID error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching question"
    });
  }
};

// @desc    Update question status and other fields
// @route   PATCH /api/quests/:id
// @access  Private
export const updateQuest = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, difficulty, notes, bookmarked, topics, lastRevisedAt } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid question ID"
      });
    }

    const quest = await Quest.findOne({ _id: id, user: req.user.id });

    if (!quest) {
      return res.status(404).json({
        success: false,
        message: "Question not found"
      });
    }

    // Update only provided fields
    if (status !== undefined) quest.status = status;
    if (difficulty !== undefined) quest.difficulty = difficulty;
    if (notes !== undefined) quest.notes = notes;
    if (bookmarked !== undefined) quest.bookmarked = bookmarked;
    if (topics !== undefined) quest.topics = topics;
    if (lastRevisedAt !== undefined) quest.lastRevisedAt = lastRevisedAt;

    await quest.save();

    res.json({
      success: true,
      message: "Question updated successfully",
      quest
    });
  } catch (error) {
    console.error("Update quest error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while updating question"
    });
  }
};

// @desc    Update question status (quick update)
// @route   PATCH /api/quests/:id/status
// @access  Private
export const updateQuestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid question ID"
      });
    }

    if (!status || !["solved", "unsolved", "for-future"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status. Must be: solved, unsolved, or for-future"
      });
    }

    const quest = await Quest.findOneAndUpdate(
      { _id: id, user: req.user.id },
      { 
        status,
        lastRevisedAt: status === "solved" ? new Date() : undefined
      },
      { new: true }
    );

    if (!quest) {
      return res.status(404).json({
        success: false,
        message: "Question not found"
      });
    }

    res.json({
      success: true,
      message: "Status updated successfully",
      quest
    });
  } catch (error) {
    console.error("Update quest status error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while updating status"
    });
  }
};

// @desc    Toggle bookmark
// @route   PATCH /api/quests/:id/bookmark
// @access  Private
export const toggleBookmark = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid question ID"
      });
    }

    const quest = await Quest.findOne({ _id: id, user: req.user.id });

    if (!quest) {
      return res.status(404).json({
        success: false,
        message: "Question not found"
      });
    }

    quest.bookmarked = !quest.bookmarked;
    await quest.save();

    res.json({
      success: true,
      message: quest.bookmarked ? "Question bookmarked" : "Bookmark removed",
      quest
    });
  } catch (error) {
    console.error("Toggle bookmark error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while toggling bookmark"
    });
  }
};

// @desc    Mark question as revised
// @route   PATCH /api/quests/:id/revise
// @access  Private
export const markAsRevised = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid question ID"
      });
    }

    const quest = await Quest.findOneAndUpdate(
      { _id: id, user: req.user.id },
      { lastRevisedAt: new Date() },
      { new: true }
    );

    if (!quest) {
      return res.status(404).json({
        success: false,
        message: "Question not found"
      });
    }

    res.json({
      success: true,
      message: "Marked as revised",
      quest
    });
  } catch (error) {
    console.error("Mark as revised error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while marking as revised"
    });
  }
};

// @desc    Delete a question
// @route   DELETE /api/quests/:id
// @access  Private
export const deleteQuest = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid question ID"
      });
    }

    const quest = await Quest.findOneAndDelete({ _id: id, user: req.user.id });

    if (!quest) {
      return res.status(404).json({
        success: false,
        message: "Question not found"
      });
    }

    res.json({
      success: true,
      message: "Question deleted successfully"
    });
  } catch (error) {
    console.error("Delete quest error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while deleting question"
    });
  }
};

// @desc    Get questions grouped by topic
// @route   GET /api/quests/grouped/topics
// @access  Private
export const getQuestsGroupedByTopic = async (req, res) => {
  try {
    const { status, difficulty, platform } = req.query;

    const matchStage = { user: new mongoose.Types.ObjectId(req.user.id) };
    
    if (status && status !== "all") matchStage.status = status;
    if (difficulty && difficulty !== "all") matchStage.difficulty = difficulty;
    if (platform && platform !== "all") matchStage.platform = platform;

    const groupedQuests = await Quest.aggregate([
      { $match: matchStage },
      { $unwind: "$topics" },
      {
        $group: {
          _id: "$topics",
          questions: { $push: "$$ROOT" },
          count: { $sum: 1 },
          solvedCount: {
            $sum: { $cond: [{ $eq: ["$status", "solved"] }, 1, 0] }
          }
        }
      },
      {
        $project: {
          topic: "$_id",
          questions: 1,
          count: 1,
          solvedCount: 1,
          _id: 0
        }
      },
      { $sort: { count: -1 } }
    ]);

    // Convert to object format
    const groupedByTopic = {};
    groupedQuests.forEach(group => {
      groupedByTopic[group.topic] = {
        questions: group.questions,
        count: group.count,
        solvedCount: group.solvedCount
      };
    });

    res.json({
      success: true,
      groupedByTopic,
      topicsList: groupedQuests.map(g => ({
        topic: g.topic,
        count: g.count,
        solvedCount: g.solvedCount
      }))
    });
  } catch (error) {
    console.error("Get grouped quests error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching grouped questions"
    });
  }
};

// @desc    Get user statistics/analytics
// @route   GET /api/quests/stats
// @access  Private
export const getQuestStats = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);

    const [
      totalStats,
      difficultyStats,
      platformStats,
      topicStats,
      recentActivity,
      needsRevision
    ] = await Promise.all([
      // Total stats
      Quest.aggregate([
        { $match: { user: userId } },
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            solved: { $sum: { $cond: [{ $eq: ["$status", "solved"] }, 1, 0] } },
            unsolved: { $sum: { $cond: [{ $eq: ["$status", "unsolved"] }, 1, 0] } },
            forFuture: { $sum: { $cond: [{ $eq: ["$status", "for-future"] }, 1, 0] } },
            bookmarked: { $sum: { $cond: ["$bookmarked", 1, 0] } }
          }
        }
      ]),

      // Stats by difficulty
      Quest.aggregate([
        { $match: { user: userId } },
        {
          $group: {
            _id: "$difficulty",
            total: { $sum: 1 },
            solved: { $sum: { $cond: [{ $eq: ["$status", "solved"] }, 1, 0] } }
          }
        }
      ]),

      // Stats by platform
      Quest.aggregate([
        { $match: { user: userId } },
        {
          $group: {
            _id: "$platform",
            total: { $sum: 1 },
            solved: { $sum: { $cond: [{ $eq: ["$status", "solved"] }, 1, 0] } }
          }
        },
        { $sort: { total: -1 } }
      ]),

      // Stats by topic
      Quest.aggregate([
        { $match: { user: userId } },
        { $unwind: "$topics" },
        {
          $group: {
            _id: "$topics",
            total: { $sum: 1 },
            solved: { $sum: { $cond: [{ $eq: ["$status", "solved"] }, 1, 0] } }
          }
        },
        { $sort: { total: -1 } },
        { $limit: 15 }
      ]),

      // Recent activity (last 7 days)
      Quest.aggregate([
        {
          $match: {
            user: userId,
            lastRevisedAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
          }
        },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$lastRevisedAt" } },
            count: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ]),

      // Questions needing revision (not revised in 7+ days)
      Quest.find({
        user: userId,
        status: "solved",
        $or: [
          { lastRevisedAt: { $lt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } },
          { lastRevisedAt: null }
        ]
      })
        .sort({ lastRevisedAt: 1 })
        .limit(10)
        .lean()
    ]);

    const stats = totalStats[0] || {
      total: 0,
      solved: 0,
      unsolved: 0,
      forFuture: 0,
      bookmarked: 0
    };

    // Format difficulty stats
    const difficultyBreakdown = {
      easy: { total: 0, solved: 0 },
      medium: { total: 0, solved: 0 },
      hard: { total: 0, solved: 0 }
    };
    difficultyStats.forEach(d => {
      if (d._id) {
        difficultyBreakdown[d._id] = { total: d.total, solved: d.solved };
      }
    });

    // Format platform stats
    const platformBreakdown = {};
    platformStats.forEach(p => {
      platformBreakdown[p._id] = { total: p.total, solved: p.solved };
    });

    // Format topic stats
    const topicBreakdown = topicStats.map(t => ({
      topic: t._id,
      total: t.total,
      solved: t.solved,
      percentage: Math.round((t.solved / t.total) * 100)
    }));

    // Calculate weak areas (topics with < 50% solved)
    const weakAreas = topicBreakdown
      .filter(t => t.percentage < 50 && t.total >= 3)
      .slice(0, 5);

    res.json({
      success: true,
      stats: {
        overview: stats,
        byDifficulty: difficultyBreakdown,
        byPlatform: platformBreakdown,
        byTopic: topicBreakdown,
        recentActivity,
        needsRevision,
        weakAreas,
        completionRate: stats.total > 0 
          ? Math.round((stats.solved / stats.total) * 100) 
          : 0
      }
    });
  } catch (error) {
    console.error("Get quest stats error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching statistics"
    });
  }
};

// @desc    Get all unique topics for the user
// @route   GET /api/quests/topics
// @access  Private
export const getAllTopics = async (req, res) => {
  try {
    const topics = await Quest.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(req.user.id) } },
      { $unwind: "$topics" },
      { $group: { _id: "$topics", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $project: { topic: "$_id", count: 1, _id: 0 } }
    ]);

    res.json({
      success: true,
      topics
    });
  } catch (error) {
    console.error("Get all topics error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching topics"
    });
  }
};

// @desc    Bulk create questions
// @route   POST /api/quests/bulk
// @access  Private
export const bulkCreateQuests = async (req, res) => {
  try {
    const { quests } = req.body;

    if (!Array.isArray(quests) || quests.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide an array of questions"
      });
    }

    if (quests.length > 100) {
      return res.status(400).json({
        success: false,
        message: "Maximum 100 questions can be added at once"
      });
    }

    const questsToInsert = quests.map(q => ({
      user: req.user.id,
      questName: q.questName,
      questNumber: q.questNumber,
      questLink: q.questLink,
      platform: q.platform,
      difficulty: q.difficulty || "medium",
      topics: q.topics || [],
      status: q.status || "unsolved",
      notes: q.notes || "",
      description: q.description || ""
    }));

    const result = await Quest.insertMany(questsToInsert, { ordered: false });

    res.status(201).json({
      success: true,
      message: `${result.length} questions added successfully`,
      count: result.length
    });
  } catch (error) {
    if (error.code === 11000) {
      // Some duplicates were skipped
      const insertedCount = error.result?.nInserted || 0;
      return res.status(207).json({
        success: true,
        message: `${insertedCount} questions added. Some duplicates were skipped.`,
        count: insertedCount
      });
    }
    console.error("Bulk create quests error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while creating questions"
    });
  }
};

// @desc    Get heatmap data for activity calendar
// @route   GET /api/quests/heatmap
// @access  Private
export const getHeatmapData = async (req, res) => {
  try {
    const { year = new Date().getFullYear() } = req.query;
    const startDate = new Date(`${year}-01-01`);
    const endDate = new Date(`${year}-12-31`);

    const heatmapData = await Quest.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(req.user.id),
          lastRevisedAt: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$lastRevisedAt" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Convert to object format for easy lookup
    const heatmap = {};
    heatmapData.forEach(d => {
      heatmap[d._id] = d.count;
    });

    res.json({
      success: true,
      year: parseInt(year),
      heatmap,
      totalDays: heatmapData.length,
      totalRevisions: heatmapData.reduce((sum, d) => sum + d.count, 0)
    });
  } catch (error) {
    console.error("Get heatmap data error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching heatmap data"
    });
  }
};
