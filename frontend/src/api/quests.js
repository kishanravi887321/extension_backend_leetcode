import api from './auth';

// Quest/Question APIs

// Get all questions with filters, search, and pagination
export const getQuests = async (params = {}) => {
  const queryParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '' && value !== 'all') {
      if (Array.isArray(value)) {
        value.forEach(v => queryParams.append(key, v));
      } else {
        queryParams.append(key, value);
      }
    }
  });

  const response = await api.get(`/quests?${queryParams.toString()}`);
  return response.data;
};

// Get single question by ID
export const getQuestById = async (id) => {
  const response = await api.get(`/quests/${id}`);
  return response.data;
};

// Create a new question
export const createQuest = async (questData) => {
  const response = await api.post('/quests', questData);
  return response.data;
};

// Update a question
export const updateQuest = async (id, updateData) => {
  const response = await api.patch(`/quests/${id}`, updateData);
  return response.data;
};

// Update question status
export const updateQuestStatus = async (id, status) => {
  const response = await api.patch(`/quests/${id}/status`, { status });
  return response.data;
};

// Toggle bookmark
export const toggleBookmark = async (id) => {
  const response = await api.patch(`/quests/${id}/bookmark`);
  return response.data;
};

// Mark as revised
export const markAsRevised = async (id) => {
  const response = await api.patch(`/quests/${id}/revise`);
  return response.data;
};

// Delete a question
export const deleteQuest = async (id) => {
  const response = await api.delete(`/quests/${id}`);
  return response.data;
};

// Get questions grouped by topic
export const getQuestsGroupedByTopic = async (params = {}) => {
  const queryParams = new URLSearchParams(params);
  const response = await api.get(`/quests/grouped/topics?${queryParams.toString()}`);
  return response.data;
};

// Get statistics
export const getQuestStats = async () => {
  const response = await api.get('/quests/stats');
  return response.data;
};

// Get all topics
export const getAllTopics = async () => {
  const response = await api.get('/quests/topics');
  return response.data;
};

// Bulk create questions
export const bulkCreateQuests = async (quests) => {
  const response = await api.post('/quests/bulk', { quests });
  return response.data;
};

// Get heatmap data
export const getHeatmapData = async (year) => {
  const response = await api.get(`/quests/heatmap${year ? `?year=${year}` : ''}`);
  return response.data;
};

export default {
  getQuests,
  getQuestById,
  createQuest,
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
};
