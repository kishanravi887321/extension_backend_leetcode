import express from "express";
import { authenticateToken } from "../middleware/auth.middleware.js";
import {
  createQuest,
  getQuests,
  getQuestById,
  updateQuest,
  updateQuestStatus,
  toggleBookmark,
  markAsRevised,
  deleteQuest,
  getQuestsGroupedByTopic,
  getQuestStats,
  getAllTopics,
  bulkCreateQuests,
  getHeatmapData
} from "../controllers/quest.controllers.js";

const router = express.Router();

// All routes are protected
router.use(authenticateToken);

// Stats and analytics routes (place before :id routes)
router.get("/stats", getQuestStats);
router.get("/topics", getAllTopics);
router.get("/grouped/topics", getQuestsGroupedByTopic);
router.get("/heatmap", getHeatmapData);

// Bulk operations
router.post("/bulk", bulkCreateQuests);

// CRUD routes
router.route("/")
  .get(getQuests)
  .post(createQuest);

router.route("/:id")
  .get(getQuestById)
  .patch(updateQuest)
  .delete(deleteQuest);

// Quick action routes
router.patch("/:id/status", updateQuestStatus);
router.patch("/:id/bookmark", toggleBookmark);
router.patch("/:id/revise", markAsRevised);

export { router };
