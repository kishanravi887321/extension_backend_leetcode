import { useState, useEffect } from 'react';
import './Modal.css';

const EditQuestionModal = ({ question, onClose, onUpdate, availableTopics }) => {
  const [formData, setFormData] = useState({
    difficulty: question.difficulty || 'medium',
    status: question.status || 'unsolved',
    topics: question.topics || [],
    notes: question.notes || '',
    bookmarked: question.bookmarked || false,
    companyTags: question.companyTags || []
  });
  const [customTopic, setCustomTopic] = useState('');
  const [customCompany, setCustomCompany] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const commonTopics = [
    'Array', 'String', 'Hash Table', 'Dynamic Programming', 'Math',
    'Sorting', 'Greedy', 'Depth-First Search', 'Binary Search', 'Tree',
    'Breadth-First Search', 'Two Pointers', 'Stack', 'Graph', 'Linked List',
    'Recursion', 'Sliding Window', 'Heap', 'Backtracking', 'Bit Manipulation'
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
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

  const handleAddCompany = () => {
    const company = customCompany.trim();
    if (company && !formData.companyTags.includes(company)) {
      setFormData(prev => ({
        ...prev,
        companyTags: [...prev.companyTags, company]
      }));
      setCustomCompany('');
    }
  };

  const handleRemoveCompany = (company) => {
    setFormData(prev => ({
      ...prev,
      companyTags: prev.companyTags.filter(c => c !== company)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await onUpdate(question._id, formData);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update question');
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
          <h2>Edit Question</h2>
          <button className="modal-close" onClick={onClose}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Question Info (Read-only) */}
        <div className="question-info-display">
          <div className="info-row">
            <span className="info-label">Question:</span>
            <span className="info-value">
              #{question.questNumber} - {question.questName}
            </span>
          </div>
          <div className="info-row">
            <span className="info-label">Platform:</span>
            <span className="info-value capitalize">{question.platform}</span>
          </div>
          <a 
            href={question.questLink} 
            target="_blank" 
            rel="noopener noreferrer"
            className="question-link"
          >
            Open Question →
          </a>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          {error && <div className="form-error">{error}</div>}

          <div className="form-row">
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

          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                name="bookmarked"
                checked={formData.bookmarked}
                onChange={handleChange}
              />
              <span className="checkbox-label">Bookmarked</span>
            </label>
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
            <label>Company Tags <span className="optional-label">(Optional)</span></label>
            <div className="custom-topic-input">
              <input
                type="text"
                placeholder="e.g., Google, Amazon, Meta..."
                value={customCompany}
                onChange={(e) => setCustomCompany(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCompany())}
              />
              <button type="button" onClick={handleAddCompany}>Add</button>
            </div>
            {formData.companyTags.length > 0 && (
              <div className="selected-topics-list">
                {formData.companyTags.map(company => (
                  <span key={company} className="selected-topic-tag company-tag">
                    🏢 {company}
                    <button type="button" onClick={() => handleRemoveCompany(company)}>×</button>
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
              rows={4}
            />
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditQuestionModal;
