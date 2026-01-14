import { useState } from 'react';
import './QuestionCard.css';

const QuestionCard = ({ 
  question, 
  onStatusChange, 
  onBookmarkToggle, 
  onDelete,
  onEdit 
}) => {
  const [showActions, setShowActions] = useState(false);
  const [updating, setUpdating] = useState(false);

  const {
    _id,
    questName,
    questNumber,
    questLink,
    platform,
    difficulty,
    status,
    topics,
    bookmarked,
    notes,
    lastRevisedAt,
    createdAt,
    companyTags
  } = question;

  const handleStatusUpdate = async (newStatus) => {
    if (updating) return;
    setUpdating(true);
    try {
      await onStatusChange(_id, newStatus);
    } finally {
      setUpdating(false);
      setShowActions(false);
    }
  };

  const handleBookmark = async () => {
    if (updating) return;
    setUpdating(true);
    try {
      await onBookmarkToggle(_id);
    } finally {
      setUpdating(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return 'Never';
    const d = new Date(date);
    const now = new Date();
    const diffDays = Math.floor((now - d) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return d.toLocaleDateString();
  };

  const getPlatformIcon = (platform) => {
    const icons = {
      leetcode: '🟡',
      codeforces: '🔵',
      gfg: '🟢',
      hackerrank: '🟢',
      codechef: '⭐',
      atcoder: '🔴',
      interviewbit: '🟣',
      other: '📝'
    };
    return icons[platform] || icons.other;
  };

  const getPlatformName = (platform) => {
    const names = {
      leetcode: 'LeetCode',
      codeforces: 'Codeforces',
      gfg: 'GeeksforGeeks',
      hackerrank: 'HackerRank',
      codechef: 'CodeChef',
      atcoder: 'AtCoder',
      interviewbit: 'InterviewBit',
      other: 'Other'
    };
    return names[platform] || platform;
  };

  const getDifficultyClass = (diff) => {
    return diff || 'medium';
  };

  const getStatusClass = (status) => {
    return status || 'unsolved';
  };

  const getCompanyIcon = (company) => {
    const companyLower = company.toLowerCase();
    const companyConfig = {
      google: { bg: 'linear-gradient(135deg, #4285F4, #34A853)', letter: 'G' },
      amazon: { bg: '#FF9900', letter: 'a', color: '#232F3E' },
      microsoft: { bg: 'linear-gradient(135deg, #F25022, #00A4EF)', letter: 'M' },
      meta: { bg: '#0668E1', letter: 'm' },
      facebook: { bg: '#0668E1', letter: 'm' },
      apple: { bg: '#000000', letter: 'A' },
      netflix: { bg: '#E50914', letter: 'N' },
      uber: { bg: '#000000', letter: 'U' },
      salesforce: { bg: '#00A1E0', letter: 'S' },
      adobe: { bg: '#FF0000', letter: 'A' },
      flipkart: { bg: '#2874F0', letter: 'F', color: '#FFE500' },
      walmart: { bg: '#0071CE', letter: 'W', color: '#FFC220' },
      deloitte: { bg: '#86BC25', letter: 'D' },
      oracle: { bg: '#F80000', letter: 'O' },
      nvidia: { bg: '#76B900', letter: 'N' },
      tcs: { bg: '#0076CE', letter: 'T' },
      infosys: { bg: '#007CC3', letter: 'I' },
      stripe: { bg: '#635BFF', letter: 'S' },
      paypal: { bg: '#003087', letter: 'P' },
      twitter: { bg: '#000000', letter: 'X' },
      linkedin: { bg: '#0A66C2', letter: 'in' },
      airbnb: { bg: '#FF5A5F', letter: 'A' },
      spotify: { bg: '#1DB954', letter: 'S' },
      atlassian: { bg: '#0052CC', letter: 'A' },
    };
    
    for (const [key, config] of Object.entries(companyConfig)) {
      if (companyLower.includes(key) || key.includes(companyLower)) {
        return (
          <span 
            className="company-icon-inline" 
            style={{ background: config.bg, color: config.color || 'white' }}
          >
            {config.letter}
          </span>
        );
      }
    }
    
    return (
      <span className="company-icon-inline default">
        {company.charAt(0).toUpperCase()}
      </span>
    );
  };

  return (
    <div className={`question-card ${getStatusClass(status)}`}>
      <div className="card-header">
        <div className="card-title-section">
          <span className="question-number">#{questNumber}</span>
          <a 
            href={questLink} 
            target="_blank" 
            rel="noopener noreferrer"
            className="question-name"
          >
            {questName}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="external-link-icon">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
            </svg>
          </a>
        </div>
        <button 
          className={`bookmark-btn ${bookmarked ? 'active' : ''}`}
          onClick={handleBookmark}
          disabled={updating}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            fill={bookmarked ? "currentColor" : "none"} 
            viewBox="0 0 24 24" 
            strokeWidth={1.5} 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
          </svg>
        </button>
      </div>

      <div className="card-meta">
        {companyTags && companyTags.length > 0 && (
          <div className="company-badges-card" title={companyTags.join(', ')}>
            {companyTags.slice(0, 2).map((company, idx) => (
              <span key={idx}>{getCompanyIcon(company)}</span>
            ))}
            {companyTags.length > 2 && (
              <span className="company-more-card">+{companyTags.length - 2}</span>
            )}
          </div>
        )}
        <span className="platform-badge">
          {getPlatformIcon(platform)} {getPlatformName(platform)}
        </span>
        <span className={`difficulty-badge ${getDifficultyClass(difficulty)}`}>
          {difficulty ? difficulty.charAt(0).toUpperCase() + difficulty.slice(1) : 'Medium'}
        </span>
        <span className={`status-badge ${getStatusClass(status)}`}>
          {status === 'for-future' ? 'For Revision' : 
           status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Unsolved'}
        </span>
      </div>

      {topics && topics.length > 0 && (
        <div className="card-topics">
          {topics.slice(0, 4).map((topic, index) => (
            <span key={index} className="topic-tag">{topic}</span>
          ))}
          {topics.length > 4 && (
            <span className="topic-tag more">+{topics.length - 4}</span>
          )}
        </div>
      )}

      {notes && (
        <div className="card-notes">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
          </svg>
          <span className="notes-preview">{notes.slice(0, 80)}{notes.length > 80 ? '...' : ''}</span>
        </div>
      )}

      <div className="card-footer">
        <div className="card-dates">
          <span className="date-item">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
            Added: {formatDate(createdAt)}
          </span>
          {lastRevisedAt && (
            <span className="date-item revised">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
              </svg>
              Revised: {formatDate(lastRevisedAt)}
            </span>
          )}
        </div>

        <div className="card-actions">
          <div className="action-buttons">
            {/* Quick Status Buttons */}
            {status !== 'solved' && (
              <button 
                className="action-btn solve"
                onClick={() => handleStatusUpdate('solved')}
                disabled={updating}
                title="Mark as Solved"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
              </button>
            )}
            
            {status !== 'for-future' && (
              <button 
                className="action-btn future"
                onClick={() => handleStatusUpdate('for-future')}
                disabled={updating}
                title="Mark for Revision"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
              </button>
            )}

            {status !== 'unsolved' && (
              <button 
                className="action-btn unsolved"
                onClick={() => handleStatusUpdate('unsolved')}
                disabled={updating}
                title="Mark as Unsolved"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            )}

            {/* More Actions */}
            <div className="more-actions">
              <button 
                className="action-btn more"
                onClick={() => setShowActions(!showActions)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                </svg>
              </button>
              
              {showActions && (
                <div className="actions-dropdown">
                  <button onClick={() => { onEdit(question); setShowActions(false); }}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                    </svg>
                    Edit
                  </button>
                  <button onClick={() => { onDelete(_id); setShowActions(false); }} className="delete">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                    </svg>
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Click outside to close dropdown */}
      {showActions && (
        <div 
          className="actions-overlay" 
          onClick={() => setShowActions(false)}
        />
      )}
    </div>
  );
};

export default QuestionCard;
