import { useState } from 'react';
import './Modal.css';

const AddQuestionModal = ({ onClose, onAdd, availableTopics }) => {
  const [formData, setFormData] = useState({
    questName: '',
    questNumber: '',
    questLink: '',
    platform: 'leetcode',
    difficulty: 'medium',
    status: 'unsolved',
    topics: [],
    notes: '',
    description: ''
  });
  const [customTopic, setCustomTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const platforms = [
    { value: 'leetcode', label: 'LeetCode' },
    { value: 'codeforces', label: 'Codeforces' },
    { value: 'gfg', label: 'GeeksforGeeks' },
    { value: 'hackerrank', label: 'HackerRank' },
    { value: 'codechef', label: 'CodeChef' },
    { value: 'atcoder', label: 'AtCoder' },
    { value: 'interviewbit', label: 'InterviewBit' },
    { value: 'spoj', label: 'SPOJ' },
    { value: 'other', label: 'Other' }
  ];

  const commonTopics = [
    'Array', 'String', 'Hash Table', 'Dynamic Programming', 'Math',
    'Sorting', 'Greedy', 'Depth-First Search', 'Binary Search', 'Tree',
    'Breadth-First Search', 'Two Pointers', 'Stack', 'Graph', 'Linked List',
    'Recursion', 'Sliding Window', 'Heap', 'Backtracking', 'Bit Manipulation'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTopicToggle = (topic) => {
    setFormData(prev => ({
      ...prev,
      topics: prev.topics.includes(topic)
        ? prev.topics.filter(t => t !== topic)
        : [...prev.topics, topic]
    }));
  };

  const handleAddCustomTopic = () => {
    const topic = customTopic.trim();
    if (topic && !formData.topics.includes(topic)) {
      setFormData(prev => ({
        ...prev,
        topics: [...prev.topics, topic]
      }));
      setCustomTopic('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.questName.trim()) {
      setError('Question name is required');
      return;
    }
    if (!formData.questNumber.trim()) {
      setError('Question number is required');
      return;
    }
    if (!formData.questLink.trim()) {
      setError('Question link is required');
      return;
    }

    setLoading(true);
    try {
      await onAdd(formData);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add question');
    } finally {
      setLoading(false);
    }
  };

  // Merge available topics with common topics
  const allTopics = [...new Set([...commonTopics, ...availableTopics])].sort();

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Add New Question</h2>
          <button className="modal-close" onClick={onClose}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          {error && <div className="form-error">{error}</div>}

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="questName">Question Name *</label>
              <input
                type="text"
                id="questName"
                name="questName"
                value={formData.questName}
                onChange={handleChange}
                placeholder="e.g., Two Sum"
                required
              />
            </div>
            <div className="form-group small">
              <label htmlFor="questNumber">Number *</label>
              <input
                type="text"
                id="questNumber"
                name="questNumber"
                value={formData.questNumber}
                onChange={handleChange}
                placeholder="e.g., 1"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="questLink">Question Link *</label>
            <input
              type="url"
              id="questLink"
              name="questLink"
              value={formData.questLink}
              onChange={handleChange}
              placeholder="https://leetcode.com/problems/two-sum"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="platform">Platform</label>
              <select
                id="platform"
                name="platform"
                value={formData.platform}
                onChange={handleChange}
              >
                {platforms.map(p => (
                  <option key={p.value} value={p.value}>{p.label}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="difficulty">Difficulty</label>
              <select
                id="difficulty"
                name="difficulty"
                value={formData.difficulty}
                onChange={handleChange}
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="status">Status</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="unsolved">Unsolved</option>
                <option value="solved">Solved</option>
                <option value="for-future">For Revision</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Topics</label>
            <div className="topics-selector">
              {allTopics.slice(0, 20).map(topic => (
                <button
                  key={topic}
                  type="button"
                  className={`topic-btn ${formData.topics.includes(topic) ? 'selected' : ''}`}
                  onClick={() => handleTopicToggle(topic)}
                >
                  {topic}
                </button>
              ))}
            </div>
            <div className="custom-topic-input">
              <input
                type="text"
                placeholder="Add custom topic..."
                value={customTopic}
                onChange={(e) => setCustomTopic(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCustomTopic())}
              />
              <button type="button" onClick={handleAddCustomTopic}>Add</button>
            </div>
            {formData.topics.length > 0 && (
              <div className="selected-topics-list">
                {formData.topics.map(topic => (
                  <span key={topic} className="selected-topic-tag">
                    {topic}
                    <button type="button" onClick={() => handleTopicToggle(topic)}>×</button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="notes">Notes</label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Add your notes, approach, time complexity, etc."
              rows={3}
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description (Optional)</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Brief problem description..."
              rows={2}
            />
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Adding...' : 'Add Question'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddQuestionModal;
