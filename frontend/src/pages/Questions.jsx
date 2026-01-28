import { useState, useEffect, useCallback, useMemo, lazy, Suspense, useRef } from 'react';
import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  getQuests, 
  updateQuestStatus, 
  toggleBookmark, 
  deleteQuest,
  getAllTopics,
  getQuestStats,
  createQuest,
  updateQuest
} from '../api/quests';
import QuestionList from '../components/QuestionList';
import AddQuestionModal from '../components/AddQuestionModal';
import EditQuestionModal from '../components/EditQuestionModal';
import './Dashboard.css'; // For sidebar styles
import './Questions.css';

// Lazy load Three.js canvas to reduce bundle size
const NotesPreviewCanvas = lazy(() => import('../components/NotesPreviewCanvas'));

// Debounce hook
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};

const Questions = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user, logout } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Questions state
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Infinite scroll state
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const listRef = useRef(null);

  // Filter states
  const [activeTab, setActiveTab] = useState(searchParams.get('status') || 'all');
  const [difficulty, setDifficulty] = useState(searchParams.get('difficulty') || 'all');
  const [platform, setPlatform] = useState(searchParams.get('platform') || 'all');
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [bookmarkedOnly, setBookmarkedOnly] = useState(searchParams.get('bookmarked') === 'true');
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'companyCount');
  const [sortOrder, setSortOrder] = useState(searchParams.get('sortOrder') || 'desc');

  // Search state
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [searchBy, setSearchBy] = useState(searchParams.get('searchBy') || 'all');
  const debouncedSearch = useDebounce(searchQuery, 300);

  // Topics state
  const [availableTopics, setAvailableTopics] = useState([]);
  const [stats, setStats] = useState(null);
  const [topicsExpanded, setTopicsExpanded] = useState(true);
  const [showAllTopics, setShowAllTopics] = useState(false);

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const notesPanelRef = useRef(null);

  // Menu items
  const menuItems = [
    { path: '/dashboard', icon: 'home', label: 'Dashboard' },
    { path: '/questions', icon: 'problems', label: 'Questions' },
    { path: '/bookmarks', icon: 'bookmark', label: 'Bookmarks' },
    { path: '/analytics', icon: 'progress', label: 'Analytics' },
    { path: '/profile', icon: 'profile', label: 'Profile' },
  ];

  // Platform options
  const platforms = [
    { value: 'all', label: 'All Platforms' },
    { value: 'leetcode', label: 'LeetCode' },
    { value: 'codeforces', label: 'Codeforces' },
    { value: 'gfg', label: 'GeeksforGeeks' },
    { value: 'hackerrank', label: 'HackerRank' },
    { value: 'codechef', label: 'CodeChef' },
    { value: 'atcoder', label: 'AtCoder' },
    { value: 'interviewbit', label: 'InterviewBit' },
    { value: 'other', label: 'Other' }
  ];

  // Difficulty options
  const difficulties = [
    { value: 'all', label: 'All' },
    { value: 'easy', label: 'Easy' },
    { value: 'medium', label: 'Medium' },
    { value: 'hard', label: 'Hard' }
  ];

  // Sort options
  const sortOptions = [
    { value: 'companyCount', label: 'Most Asked (Companies)' },
    { value: 'createdAt', label: 'Date Added' },
    { value: 'lastRevisedAt', label: 'Last Revised' },
    { value: 'difficulty', label: 'Difficulty' },
    { value: 'questNumber', label: 'Question Number' },
    { value: 'questName', label: 'Name' }
  ];

  // Fetch questions with infinite scroll support
  const fetchQuestions = useCallback(async (pageNum = 1, append = false) => {
    if (append) {
      setIsLoadingMore(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      const params = {
        page: pageNum,
        limit: 20,
        sortBy,
        sortOrder
      };

      if (activeTab !== 'all') params.status = activeTab;
      if (difficulty !== 'all') params.difficulty = difficulty;
      if (platform !== 'all') params.platform = platform;
      if (selectedTopics.length > 0) params.topics = selectedTopics.join(',');
      if (bookmarkedOnly) params.bookmarked = 'true';
      if (debouncedSearch) {
        params.search = debouncedSearch;
        params.searchBy = searchBy;
      }

      const response = await getQuests(params);

      if (response.success) {
        if (append) {
          setQuestions(prev => [...prev, ...response.quests]);
        } else {
          setQuestions(response.quests);
        }
        setHasMore(response.pagination.hasNextPage);
        setTotalCount(response.pagination.totalCount);
      }
    } catch (err) {
      console.error('Error fetching questions:', err);
      setError('Failed to load questions. Please try again.');
    } finally {
      setLoading(false);
      setIsLoadingMore(false);
    }
  }, [activeTab, difficulty, platform, selectedTopics, bookmarkedOnly, sortBy, sortOrder, debouncedSearch, searchBy]);

  // Fetch topics and stats
  const fetchTopicsAndStats = useCallback(async () => {
    try {
      const [topicsRes, statsRes] = await Promise.all([
        getAllTopics(),
        getQuestStats()
      ]);

      if (topicsRes.success) setAvailableTopics(topicsRes.topics);
      if (statsRes.success) setStats(statsRes.stats);
    } catch (err) {
      console.error('Error fetching topics/stats:', err);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchTopicsAndStats();
  }, [fetchTopicsAndStats]);

  // Click outside to close notes panel
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notesPanelRef.current && !notesPanelRef.current.contains(event.target)) {
        setSelectedQuestion(null);
      }
    };

    if (selectedQuestion) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [selectedQuestion]);

  // Reset and fetch when filters change
  useEffect(() => {
    setPage(1);
    setQuestions([]);
    fetchQuestions(1, false);
  }, [activeTab, difficulty, platform, selectedTopics, bookmarkedOnly, sortBy, sortOrder, debouncedSearch, searchBy]);

  // Infinite scroll detection
  useEffect(() => {
    const listElement = listRef.current;
    if (!listElement) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = listElement;
      
      // Load more when scrolled to 80% of the list
      if (scrollHeight - scrollTop <= clientHeight * 1.5 && hasMore && !isLoadingMore && !loading) {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchQuestions(nextPage, true);
      }
    };

    listElement.addEventListener('scroll', handleScroll);
    return () => listElement.removeEventListener('scroll', handleScroll);
  }, [page, hasMore, isLoadingMore, loading, fetchQuestions]);

  // Update URL params when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    
    if (activeTab !== 'all') params.set('status', activeTab);
    if (difficulty !== 'all') params.set('difficulty', difficulty);
    if (platform !== 'all') params.set('platform', platform);
    if (bookmarkedOnly) params.set('bookmarked', 'true');
    if (sortBy !== 'companyCount') params.set('sortBy', sortBy);
    if (sortOrder !== 'desc') params.set('sortOrder', sortOrder);
    if (debouncedSearch) {
      params.set('search', debouncedSearch);
      params.set('searchBy', searchBy);
    }

    setSearchParams(params, { replace: true });
  }, [activeTab, difficulty, platform, bookmarkedOnly, sortBy, sortOrder, debouncedSearch, searchBy, setSearchParams]);

  // Handlers
  const handleStatusChange = async (id, newStatus) => {
    try {
      // Optimistic update
      setQuestions(prev => 
        prev.map(q => q._id === id ? { ...q, status: newStatus } : q)
      );

      const response = await updateQuestStatus(id, newStatus);
      
      if (!response.success) {
        // Revert on failure
        fetchQuestions();
      } else {
        // Update stats
        fetchTopicsAndStats();
      }
    } catch (err) {
      console.error('Error updating status:', err);
      fetchQuestions();
    }
  };

  const handleBookmarkToggle = async (id) => {
    try {
      // Optimistic update
      setQuestions(prev => 
        prev.map(q => q._id === id ? { ...q, bookmarked: !q.bookmarked } : q)
      );

      const response = await toggleBookmark(id);
      
      if (!response.success) {
        fetchQuestions();
      }
    } catch (err) {
      console.error('Error toggling bookmark:', err);
      fetchQuestions();
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this question?')) return;

    try {
      // Optimistic update
      setQuestions(prev => prev.filter(q => q._id !== id));

      const response = await deleteQuest(id);
      
      if (response.success) {
        fetchTopicsAndStats();
      } else {
        fetchQuestions();
      }
    } catch (err) {
      console.error('Error deleting question:', err);
      fetchQuestions();
    }
  };

  const handleEditClick = (question) => {
    setEditingQuestion(question);
    setShowEditModal(true);
  };

  // Handle clicking on a topic from the question list - filters to show only that topic
  const handleTopicClick = (topic) => {
    // Set only this topic as selected (replaces current selection)
    setSelectedTopics([topic]);
  };

  const handleAddQuestion = async (questionData) => {
    try {
      const response = await createQuest(questionData);
      if (response.success) {
        setShowAddModal(false);
        fetchQuestions();
        fetchTopicsAndStats();
      }
      return response;
    } catch (err) {
      throw err;
    }
  };

  const handleUpdateQuestion = async (id, updateData) => {
    try {
      const response = await updateQuest(id, updateData);
      if (response.success) {
        setShowEditModal(false);
        setEditingQuestion(null);
        fetchQuestions();
        fetchTopicsAndStats();
      }
      return response;
    } catch (err) {
      throw err;
    }
  };

  const handleTopicToggle = (topic) => {
    setSelectedTopics(prev => 
      prev.includes(topic)
        ? prev.filter(t => t !== topic)
        : [...prev, topic]
    );
  };

  const clearFilters = () => {
    setActiveTab('all');
    setDifficulty('all');
    setPlatform('all');
    setSelectedTopics([]);
    setBookmarkedOnly(false);
    setSearchQuery('');
    setSortBy('companyCount');
    setSortOrder('desc');
    setSearchParams({});
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Icons
  const getIcon = (iconName) => {
    const icons = {
      home: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
        </svg>
      ),
      problems: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
      ),
      bookmark: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
        </svg>
      ),
      progress: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
        </svg>
      ),
      profile: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
        </svg>
      ),
    };
    return icons[iconName];
  };

  // Calculate active filters count
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (activeTab !== 'all') count++;
    if (difficulty !== 'all') count++;
    if (platform !== 'all') count++;
    if (selectedTopics.length > 0) count++;
    if (bookmarkedOnly) count++;
    if (debouncedSearch) count++;
    return count;
  }, [activeTab, difficulty, platform, selectedTopics, bookmarkedOnly, debouncedSearch]);

  return (
    <div className="questions-layout">
      {/* Animated Background */}
      <div className="questions-page-background">
        <Suspense fallback={null}>
          <NotesPreviewCanvas />
        </Suspense>
      </div>
      
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <div className="logo-icon">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
            </div>
            {!sidebarCollapsed && <span className="logo-text">CPCoders</span>}
          </div>
          <button 
            className="sidebar-toggle"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d={sidebarCollapsed ? "M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" : "M3.75 6.75h16.5M3.75 12h16.5M12 17.25h8.25"} />
            </svg>
          </button>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
            >
              <span className="nav-icon">{getIcon(item.icon)}</span>
              {!sidebarCollapsed && <span className="nav-label">{item.label}</span>}
            </Link>
          ))}
        </nav>

        {/* Topics Sidebar Section */}
        {!sidebarCollapsed && (
          <div className="sidebar-topics">
            <div 
              className="topics-header"
              onClick={() => setTopicsExpanded(!topicsExpanded)}
            >
              <span>Topics</span>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                strokeWidth={1.5} 
                stroke="currentColor"
                className={`topics-toggle ${topicsExpanded ? 'expanded' : ''}`}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
              </svg>
            </div>
            {topicsExpanded && (
              <div className="topics-list">
                {(showAllTopics ? availableTopics : availableTopics.slice(0, 7)).map(({ topic, count }) => (
                  <button
                    key={topic}
                    className={`topic-item ${selectedTopics.includes(topic) ? 'selected' : ''}`}
                    onClick={() => handleTopicToggle(topic)}
                  >
                    <span className="topic-name">{topic}</span>
                    <span className="topic-count">{count}</span>
                  </button>
                ))}
                {availableTopics.length > 7 && (
                  <button 
                    className="show-more-topics"
                    onClick={() => setShowAllTopics(!showAllTopics)}
                  >
                    {showAllTopics ? 'Show less' : `+${availableTopics.length - 7} more`}
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">
              {user?.picture ? (
                <img src={user.picture} alt={user.name} />
              ) : (
                <span>{user?.name?.charAt(0).toUpperCase() || 'U'}</span>
              )}
            </div>
            {!sidebarCollapsed && (
              <div className="user-details">
                <span className="user-name">{user?.name?.split(' ')[0] || 'User'}</span>
                <span className="user-email">{user?.email}</span>
              </div>
            )}
          </div>
          <button className="logout-btn" onClick={handleLogout} title="Logout">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
            </svg>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {/* Header */}
        <header className="content-header">
          <div className="header-left">
            <h1>Questions</h1>
            <p>Manage your DSA problems</p>
          </div>
          <div className="header-right">
            <div className="search-container">
              <div className="search-box">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
                <input 
                  type="text" 
                  placeholder="Search questions..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button 
                    className="clear-search"
                    onClick={() => setSearchQuery('')}
                  >
                    ×
                  </button>
                )}
              </div>
              <select 
                className="search-by-select"
                value={searchBy}
                onChange={(e) => setSearchBy(e.target.value)}
              >
                <option value="all">All</option>
                <option value="name">Name</option>
                <option value="number">Number</option>
              </select>
            </div>
            <button 
              className="add-question-btn"
              onClick={() => setShowAddModal(true)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Add Question
            </button>
          </div>
        </header>

        {/* Stats Cards */}
        {stats && (
          <div className="stats-row">
            <div 
              className={`stat-card ${activeTab === 'all' && !bookmarkedOnly ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('all');
                setBookmarkedOnly(false);
              }}
            >
              <div className="stat-value">{stats.overview.total}</div>
              <div className="stat-label">Total</div>
            </div>
            <div 
              className={`stat-card solved ${activeTab === 'solved' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('solved');
                setBookmarkedOnly(false);
              }}
            >
              <div className="stat-value">{stats.overview.solved}</div>
              <div className="stat-label">Solved</div>
            </div>
            <div 
              className={`stat-card unsolved ${activeTab === 'unsolved' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('unsolved');
                setBookmarkedOnly(false);
              }}
            >
              <div className="stat-value">{stats.overview.unsolved}</div>
              <div className="stat-label">Unsolved</div>
            </div>
            <div 
              className={`stat-card for-future ${activeTab === 'for-future' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('for-future');
                setBookmarkedOnly(false);
              }}
            >
              <div className="stat-value">{stats.overview.forFuture}</div>
              <div className="stat-label">For Future</div>
            </div>
            <div 
              className={`stat-card bookmarked ${bookmarkedOnly ? 'active' : ''}`}
              onClick={() => {
                setBookmarkedOnly(!bookmarkedOnly);
              }}
            >
              <div className="stat-value">{stats.overview.bookmarked}</div>
              <div className="stat-label">Bookmarked</div>
            </div>
          </div>
        )}

        {/* Filters Section */}
        <div className="filters-section">
          {/* Status Tabs */}
          <div className="status-tabs">
            {['all', 'solved', 'unsolved', 'for-future'].map(status => (
              <button
                key={status}
                className={`status-tab ${activeTab === status ? 'active' : ''}`}
                onClick={() => setActiveTab(status)}
              >
                {status === 'all' ? 'All' : 
                 status === 'for-future' ? 'For Revision' :
                 status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>

          {/* Filter Controls */}
          <div className="filter-controls">
            <div className="filter-group">
              <label>Difficulty</label>
              <div className="difficulty-chips">
                {difficulties.map(diff => (
                  <button
                    key={diff.value}
                    className={`difficulty-chip ${diff.value} ${difficulty === diff.value ? 'active' : ''}`}
                    onClick={() => setDifficulty(diff.value)}
                  >
                    {diff.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="filter-group">
              <label>Platform</label>
              <select 
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
              >
                {platforms.map(p => (
                  <option key={p.value} value={p.value}>{p.label}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Sort By</label>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                {sortOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Order</label>
              <select 
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
              >
                <option value="desc">High to Low</option>
                <option value="asc">Low to High</option>
              </select>
            </div>

            <button 
              className={`bookmark-filter ${bookmarkedOnly ? 'active' : ''}`}
              onClick={() => setBookmarkedOnly(!bookmarkedOnly)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill={bookmarkedOnly ? "currentColor" : "none"} viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
              </svg>
              Bookmarked
            </button>

            {activeFiltersCount > 0 && (
              <button className="clear-filters" onClick={clearFilters}>
                Clear Filters ({activeFiltersCount})
              </button>
            )}
          </div>

          {/* Selected Topics */}
          {selectedTopics.length > 0 && (
            <div className="selected-topics">
              <span>Selected Topics:</span>
              {selectedTopics.map(topic => (
                <span key={topic} className="selected-topic">
                  {topic}
                  <button onClick={() => handleTopicToggle(topic)}>×</button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Questions List */}
        <div className="questions-content">
          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Loading questions...</p>
            </div>
          ) : error ? (
            <div className="error-container">
              <p>{error}</p>
              <button onClick={() => fetchQuestions(1, false)}>Retry</button>
            </div>
          ) : questions.length === 0 ? (
            <div className="empty-state">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
              </svg>
              <h3>No questions found</h3>
              <p>
                {activeFiltersCount > 0 
                  ? 'Try adjusting your filters or search query'
                  : 'Add your first question to get started'}
              </p>
              {activeFiltersCount === 0 && (
                <button 
                  className="add-first-btn"
                  onClick={() => setShowAddModal(true)}
                >
                  Add Question
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="infinite-scroll-info">
                <span className="total-count">
                  Showing {questions.length} of {totalCount} questions
                </span>
              </div>
              
              <QuestionList
                questions={questions}
                onStatusChange={handleStatusChange}
                onBookmarkToggle={handleBookmarkToggle}
                onDelete={handleDelete}
                onEdit={handleEditClick}
                onTopicClick={handleTopicClick}
                onRowClick={setSelectedQuestion}
                selectedQuestionId={selectedQuestion?._id}
                listRef={listRef}
              />

              {/* Loading More Indicator */}
              {isLoadingMore && (
                <div className="loading-more">
                  <div className="loading-spinner small"></div>
                  <span>Loading more questions...</span>
                </div>
              )}

              {/* End of List Indicator */}
              {!hasMore && questions.length > 0 && (
                <div className="end-of-list">
                  <span>You've reached the end of the list</span>
                </div>
              )}

              {/* Floating Notes Preview */}
              {selectedQuestion && (
                <div className="notes-preview-overlay active" ref={notesPanelRef}>
                  <div className="notes-panel-header">
                      <h3>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                        </svg>
                        Notes Preview
                      </h3>
                      <button 
                        className="notes-close-btn"
                        onClick={() => setSelectedQuestion(null)}
                        title="Close"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                        </svg>
                      </button>
                  </div>
                  <div className="notes-panel-content">
                    {selectedQuestion.notes ? (
                      <div className="note-content">
                        <h4>{selectedQuestion.questName}</h4>
                        <div className="note-text">{selectedQuestion.notes}</div>
                      </div>
                    ) : (
                      <div className="no-notes">
                        <h4>{selectedQuestion.questName}</h4>
                        <p>No notes added yet.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* Modals */}
      {showAddModal && (
        <AddQuestionModal
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddQuestion}
          availableTopics={availableTopics.map(t => t.topic)}
        />
      )}

      {showEditModal && editingQuestion && (
        <EditQuestionModal
          question={editingQuestion}
          onClose={() => {
            setShowEditModal(false);
            setEditingQuestion(null);
          }}
          onUpdate={handleUpdateQuestion}
          availableTopics={availableTopics.map(t => t.topic)}
        />
      )}
    </div>
  );
};

export default Questions;
