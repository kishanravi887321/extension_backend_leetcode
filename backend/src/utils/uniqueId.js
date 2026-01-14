/**
 * Unique ID Generator for Coding Questions
 * 
 * Generates deterministic, collision-free unique identifiers for questions
 * across multiple coding platforms.
 * 
 * Rules:
 * - LeetCode: platform + questionNumber + userId
 * - Other platforms: platform + normalizedTitle + userId
 */

/**
 * Normalizes a question title for use in unique ID generation.
 * - Converts to lowercase
 * - Removes special characters
 * - Removes spaces
 * - Trims whitespace
 * 
 * @param {string} title - The question title to normalize
 * @returns {string} - Normalized title
 */
export const normalizeTitle = (title) => {
  if (!title || typeof title !== 'string') {
    return '';
  }
  
  return title
    .toLowerCase()                    // Convert to lowercase
    .trim()                           // Remove leading/trailing whitespace
    .replace(/[^a-z0-9]/g, '');       // Remove all non-alphanumeric characters
};

/**
 * Generates a unique identifier for a coding question.
 * 
 * The ID format ensures:
 * - Same user + same question + same platform = same UniqueID (deterministic)
 * - Different users OR different questions OR different platforms = different UniqueID
 * 
 * @param {Object} params - Parameters for generating the unique ID
 * @param {string} params.platform - The coding platform (e.g., 'leetcode', 'codeforces')
 * @param {string} [params.questNumber] - The question number (required for LeetCode)
 * @param {string} [params.questName] - The question title (used for non-LeetCode platforms)
 * @param {string} params.userId - The user's unique identifier
 * @returns {string} - A unique identifier string
 * @throws {Error} - If required parameters are missing
 */
export const generateUniqueId = ({ platform, questNumber, questName, userId }) => {
  // Validate required parameters
  if (!platform) {
    throw new Error('Platform is required for unique ID generation');
  }
  
  if (!userId) {
    throw new Error('User ID is required for unique ID generation');
  }
  
  const normalizedPlatform = platform.toLowerCase().trim();
  const userIdStr = String(userId);
  
  // LeetCode uses numeric question IDs
  if (normalizedPlatform === 'leetcode') {
    if (!questNumber) {
      throw new Error('Question number is required for LeetCode platform');
    }
    // Format: leetcode_<questNumber>_<userId>
    return `${normalizedPlatform}_${String(questNumber).trim()}_${userIdStr}`;
  }
  
  // Other platforms use normalized question titles
  if (!questName) {
    throw new Error('Question name is required for non-LeetCode platforms');
  }
  
  const normalizedTitle = normalizeTitle(questName);
  
  if (!normalizedTitle) {
    throw new Error('Question name must contain at least one alphanumeric character');
  }
  
  // Format: <platform>_<normalizedTitle>_<userId>
  return `${normalizedPlatform}_${normalizedTitle}_${userIdStr}`;
};

/**
 * Generates a question identifier without the user component.
 * Useful for identifying the same question across users.
 * 
 * @param {Object} params - Parameters for generating the question ID
 * @param {string} params.platform - The coding platform
 * @param {string} [params.questNumber] - The question number (for LeetCode)
 * @param {string} [params.questName] - The question title (for other platforms)
 * @returns {string} - A question identifier string
 */
export const generateQuestionId = ({ platform, questNumber, questName }) => {
  if (!platform) {
    throw new Error('Platform is required for question ID generation');
  }
  
  const normalizedPlatform = platform.toLowerCase().trim();
  
  if (normalizedPlatform === 'leetcode') {
    if (!questNumber) {
      throw new Error('Question number is required for LeetCode platform');
    }
    return `${normalizedPlatform}_${String(questNumber).trim()}`;
  }
  
  if (!questName) {
    throw new Error('Question name is required for non-LeetCode platforms');
  }
  
  const normalizedTitle = normalizeTitle(questName);
  
  if (!normalizedTitle) {
    throw new Error('Question name must contain at least one alphanumeric character');
  }
  
  return `${normalizedPlatform}_${normalizedTitle}`;
};

/**
 * Validates if a given unique ID matches the expected format.
 * 
 * @param {string} uniqueId - The unique ID to validate
 * @returns {boolean} - True if valid, false otherwise
 */
export const isValidUniqueId = (uniqueId) => {
  if (!uniqueId || typeof uniqueId !== 'string') {
    return false;
  }
  
  // Expected format: platform_identifier_userId
  const parts = uniqueId.split('_');
  
  // Must have at least 3 parts (platform, identifier, userId)
  // Note: identifier might contain underscores in some cases, so we check for minimum
  return parts.length >= 3 && parts[0].length > 0 && parts[parts.length - 1].length > 0;
};

/**
 * Parses a unique ID to extract its components.
 * 
 * @param {string} uniqueId - The unique ID to parse
 * @returns {Object|null} - Parsed components or null if invalid
 */
export const parseUniqueId = (uniqueId) => {
  if (!isValidUniqueId(uniqueId)) {
    return null;
  }
  
  const parts = uniqueId.split('_');
  const platform = parts[0];
  const userId = parts[parts.length - 1];
  const identifier = parts.slice(1, -1).join('_');
  
  return {
    platform,
    identifier,
    userId,
    isLeetCode: platform === 'leetcode'
  };
};

export default {
  normalizeTitle,
  generateUniqueId,
  generateQuestionId,
  isValidUniqueId,
  parseUniqueId
};
