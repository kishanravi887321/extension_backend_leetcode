import { useState } from 'react';
import './QuestionList.css';

const QuestionList = ({ 
  questions, 
  onStatusChange, 
  onBookmarkToggle, 
  onDelete,
  onEdit,
  onTopicClick
}) => {
  const [expandedRow, setExpandedRow] = useState(null);

  const handleStatusToggle = async (e, id, currentStatus) => {
    e.stopPropagation();
    const newStatus = currentStatus === 'solved' ? 'unsolved' : 'solved';
    await onStatusChange(id, newStatus);
  };

  const handleBookmark = async (e, id) => {
    e.stopPropagation();
    await onBookmarkToggle(id);
  };

  const handleDelete = (e, id) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this question?')) {
      onDelete(id);
    }
  };

  const handleEdit = (e, question) => {
    e.stopPropagation();
    onEdit(question);
  };

  const getDifficultyLabel = (diff) => {
    const labels = {
      easy: 'Easy',
      medium: 'Med.',
      hard: 'Hard'
    };
    return labels[diff] || 'Med.';
  };

  const formatDate = (date) => {
    if (!date) return '-';
    const d = new Date(date);
    const now = new Date();
    const diffDays = Math.floor((now - d) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getCompanyIcon = (company) => {
    const companyLower = company.toLowerCase();
    const companyIcons = {
      google: <span className="company-icon google">G</span>,
      amazon: <span className="company-icon amazon">a</span>,
      microsoft: <span className="company-icon microsoft">M</span>,
      meta: <span className="company-icon meta">m</span>,
      facebook: <span className="company-icon meta">m</span>,
      apple: <span className="company-icon apple">A</span>,
      netflix: <span className="company-icon netflix">N</span>,
      uber: <span className="company-icon uber">U</span>,
      salesforce: <span className="company-icon salesforce">S</span>,
      adobe: <span className="company-icon adobe">A</span>,
      oracle: <span className="company-icon oracle">O</span>,
      ibm: <span className="company-icon ibm">I</span>,
      intel: <span className="company-icon intel">i</span>,
      cisco: <span className="company-icon cisco">C</span>,
      vmware: <span className="company-icon vmware">V</span>,
      flipkart: <span className="company-icon flipkart">F</span>,
      walmart: <span className="company-icon walmart">W</span>,
      deloitte: <span className="company-icon deloitte">D</span>,
      accenture: <span className="company-icon accenture">A</span>,
      tcs: <span className="company-icon tcs">T</span>,
      infosys: <span className="company-icon infosys">I</span>,
      wipro: <span className="company-icon wipro">W</span>,
      cognizant: <span className="company-icon cognizant">C</span>,
      paypal: <span className="company-icon paypal">P</span>,
      stripe: <span className="company-icon stripe">S</span>,
      twitter: <span className="company-icon twitter">X</span>,
      linkedin: <span className="company-icon linkedin">in</span>,
      airbnb: <span className="company-icon airbnb">A</span>,
      spotify: <span className="company-icon spotify">S</span>,
      snap: <span className="company-icon snap">S</span>,
      nvidia: <span className="company-icon nvidia">N</span>,
      samsung: <span className="company-icon samsung">S</span>,
      jpmorgan: <span className="company-icon jpmorgan">JP</span>,
      goldman: <span className="company-icon goldman">GS</span>,
      bloomberg: <span className="company-icon bloomberg">B</span>,
      atlassian: <span className="company-icon atlassian">A</span>,
      shopify: <span className="company-icon shopify">S</span>,
      dropbox: <span className="company-icon dropbox">D</span>,
      zoom: <span className="company-icon zoom">Z</span>,
      slack: <span className="company-icon slack">S</span>,
      twilio: <span className="company-icon twilio">T</span>,
      servicenow: <span className="company-icon servicenow">S</span>,
      databricks: <span className="company-icon databricks">D</span>,
      snowflake: <span className="company-icon snowflake">S</span>,
      palantir: <span className="company-icon palantir">P</span>,
      lyft: <span className="company-icon lyft">L</span>,
      doordash: <span className="company-icon doordash">D</span>,
      instacart: <span className="company-icon instacart">I</span>,
      robinhood: <span className="company-icon robinhood">R</span>,
      coinbase: <span className="company-icon coinbase">C</span>,
      bytedance: <span className="company-icon bytedance">B</span>,
      tiktok: <span className="company-icon bytedance">T</span>,
    };
    
    // Check for partial matches
    for (const [key, icon] of Object.entries(companyIcons)) {
      if (companyLower.includes(key) || key.includes(companyLower)) {
        return icon;
      }
    }
    
    // Default icon with first letter
    return <span className="company-icon default">{company.charAt(0).toUpperCase()}</span>;
  };

  const getPlatformIcon = (platform) => {
    const icons = {
      leetcode: (
        <svg viewBox="0 0 24 24" className="platform-icon leetcode">
          <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z" fill="currentColor"/>
        </svg>
      ),
      codeforces: <span className="platform-icon-text cf">CF</span>,
      gfg: <span className="platform-icon-text gfg">GFG</span>,
      hackerrank: <span className="platform-icon-text hr">HR</span>,
      codechef: <span className="platform-icon-text cc">CC</span>,
      atcoder: <span className="platform-icon-text ac">AC</span>,
      interviewbit: <span className="platform-icon-text ib">IB</span>,
      other: <span className="platform-icon-text other">?</span>
    };
    return icons[platform] || icons.other;
  };

  return (
    <div className="question-list">
      {/* Header */}
      <div className="list-header">
        <div className="col-status">Status</div>
        <div className="col-title">Title</div>
        <div className="col-company">Company</div>
        <div className="col-platform">Platform</div>
        <div className="col-difficulty">Difficulty</div>
        <div className="col-actions">Actions</div>
      </div>

      {/* Question Rows */}
      <div className="list-body">
        {questions.map((question, index) => (
          <div 
            key={question._id} 
            className={`list-row ${index % 2 === 0 ? 'even' : 'odd'} ${expandedRow === question._id ? 'expanded' : ''}`}
            onClick={() => setExpandedRow(expandedRow === question._id ? null : question._id)}
          >
            <div className="row-main">
              {/* Status Column */}
              <div className="col-status">
                <button 
                  className={`status-check ${question.status}`}
                  onClick={(e) => handleStatusToggle(e, question._id, question.status)}
                  title={question.status === 'solved' ? 'Mark as unsolved' : 'Mark as solved'}
                >
                  {question.status === 'solved' ? (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                      <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
                    </svg>
                  ) : question.status === 'for-future' ? (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                      <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 6a.75.75 0 0 0-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 0 0 0-1.5h-3.75V6Z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <circle cx="12" cy="12" r="9" />
                    </svg>
                  )}
                </button>
              </div>

              {/* Title Column */}
              <div className="col-title">
                <a 
                  href={question.questLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="question-link"
                  onClick={(e) => e.stopPropagation()}
                >
                  <span className="question-number">{question.questNumber}.</span>
                  <span className="question-name">{question.questName}</span>
                </a>
              </div>

              {/* Company Column */}
              <div className="col-company">
                {question.companyTags && question.companyTags.length > 0 ? (
                  <div className="company-badges" title={question.companyTags.join(', ')}>
                    {getCompanyIcon(question.companyTags[0])}
                    {question.companyTags.length > 1 && (
                      <span className="company-more">+{question.companyTags.length - 1}</span>
                    )}
                  </div>
                ) : (
                  <span className="company-badge empty">-</span>
                )}
              </div>

              {/* Platform Column - Click to expand and see topics */}
              <div className="col-platform">
                <div className="platform-badge" title="Click row to see topics">
                  {getPlatformIcon(question.platform)}
                </div>
              </div>

              {/* Difficulty Column */}
              <div className="col-difficulty">
                <span className={`difficulty-badge ${question.difficulty}`}>
                  {getDifficultyLabel(question.difficulty)}
                </span>
              </div>

              {/* Actions Column */}
              <div className="col-actions">
                <button 
                  className={`action-btn bookmark ${question.bookmarked ? 'active' : ''}`}
                  onClick={(e) => handleBookmark(e, question._id)}
                  title={question.bookmarked ? 'Remove bookmark' : 'Bookmark'}
                >
                  {question.bookmarked ? (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                      <path fillRule="evenodd" d="M6.32 2.577a49.255 49.255 0 0 1 11.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 0 1-1.085.67L12 18.089l-7.165 3.583A.75.75 0 0 1 3.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93Z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
                    </svg>
                  )}
                </button>
                <button 
                  className="action-btn edit"
                  onClick={(e) => handleEdit(e, question)}
                  title="Edit"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                  </svg>
                </button>
                <button 
                  className="action-btn delete"
                  onClick={(e) => handleDelete(e, question._id)}
                  title="Delete"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Expanded Row Details */}
            {expandedRow === question._id && (
              <div className="row-expanded">
                <div className="expanded-content">
                  <div className="expanded-info">
                    <div className="info-item">
                      <span className="info-label">Platform:</span>
                      <span className="info-value capitalize">{question.platform}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Added:</span>
                      <span className="info-value">{formatDate(question.createdAt)}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Last Revised:</span>
                      <span className="info-value">{formatDate(question.lastRevisedAt)}</span>
                    </div>
                  </div>
                  {question.notes && (
                    <div className="expanded-notes">
                      <span className="notes-label">Notes:</span>
                      <p className="notes-text">{question.notes}</p>
                    </div>
                  )}
                  {question.topics && question.topics.length > 0 && (
                    <div className="expanded-topics">
                      <span className="topics-label">All Topics:</span>
                      <div className="topics-full">
                        {question.topics.map((topic, i) => (
                          <span 
                            key={i} 
                            className="topic-chip"
                            onClick={(e) => {
                              e.stopPropagation();
                              onTopicClick && onTopicClick(topic);
                            }}
                          >
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="expanded-actions">
                    <button 
                      className={`quick-status-btn ${question.status === 'solved' ? 'active' : ''}`}
                      onClick={(e) => { e.stopPropagation(); onStatusChange(question._id, 'solved'); }}
                    >
                      ✓ Solved
                    </button>
                    <button 
                      className={`quick-status-btn ${question.status === 'unsolved' ? 'active' : ''}`}
                      onClick={(e) => { e.stopPropagation(); onStatusChange(question._id, 'unsolved'); }}
                    >
                      ○ Unsolved
                    </button>
                    <button 
                      className={`quick-status-btn ${question.status === 'for-future' ? 'active' : ''}`}
                      onClick={(e) => { e.stopPropagation(); onStatusChange(question._id, 'for-future'); }}
                    >
                      ⏰ For Future
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuestionList;
