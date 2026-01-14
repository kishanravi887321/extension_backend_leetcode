import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getQuestStats, getQuests } from '../api/auth';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [stats, setStats] = useState(null);
  const [recentQuests, setRecentQuests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, questsRes] = await Promise.all([
        getQuestStats(),
        getQuests({ limit: 5, sortBy: 'updatedAt', sortOrder: 'desc' })
      ]);

      if (statsRes.success) {
        setStats(statsRes.stats);
      }
      if (questsRes.success) {
        setRecentQuests(questsRes.quests);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { path: '/dashboard', icon: 'home', label: 'Dashboard' },
    { path: '/problems', icon: 'problems', label: 'Problems' },
    { path: '/bookmarks', icon: 'bookmark', label: 'Bookmarks' },
    { path: '/progress', icon: 'progress', label: 'Analytics' },
    { path: '/profile', icon: 'profile', label: 'Profile' },
  ];

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

  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  const getStatusIcon = (status) => {
    if (status === 'solved') {
      return <span className="status-dot solved"></span>;
    } else if (status === 'for-future') {
      return <span className="status-dot for-future"></span>;
    }
    return <span className="status-dot unsolved"></span>;
  };

  const overview = stats?.overview || { total: 0, solved: 0, unsolved: 0, forFuture: 0, bookmarked: 0 };
  const topicCount = stats?.byTopic?.length || 0;

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <div className="logo-icon">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" />
              </svg>
            </div>
            {!sidebarCollapsed && <span className="logo-text">CPTracker</span>}
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
            <h1>Dashboard</h1>
            <p>Track your coding progress</p>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="dashboard-content">
          {/* Welcome Card */}
          <div className="welcome-card">
            <div className="welcome-info">
              <h2>Welcome back, {user?.name?.split(' ')[0] || 'User'}! 👋</h2>
              <p>
                {overview.total === 0 
                  ? "Start tracking your DSA problems today!"
                  : `You've solved ${overview.solved} out of ${overview.total} problems. ${stats?.completionRate || 0}% completion rate!`
                }
              </p>
              <Link to="/problems" className="start-btn">
                {overview.total === 0 ? 'Add Your First Problem' : 'Continue Solving'}
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            </div>
            <div className="welcome-illustration">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" />
              </svg>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon solved">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
              </div>
              <div className="stat-info">
                <span className="stat-value">{loading ? '...' : overview.solved}</span>
                <span className="stat-label">Problems Solved</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon total">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 0 1 0 3.75H5.625a1.875 1.875 0 0 1 0-3.75Z" />
                </svg>
              </div>
              <div className="stat-info">
                <span className="stat-value">{loading ? '...' : overview.total}</span>
                <span className="stat-label">Total Problems</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon bookmarked">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
                </svg>
              </div>
              <div className="stat-info">
                <span className="stat-value">{loading ? '...' : overview.bookmarked}</span>
                <span className="stat-label">Bookmarked</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon topics">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6Z" />
                </svg>
              </div>
              <div className="stat-info">
                <span className="stat-value">{loading ? '...' : topicCount}</span>
                <span className="stat-label">Topics Covered</span>
              </div>
            </div>
          </div>

          {/* Difficulty Breakdown */}
          {stats?.byDifficulty && (
            <div className="difficulty-section">
              <h3>Difficulty Breakdown</h3>
              <div className="difficulty-cards">
                <div className="difficulty-card easy">
                  <div className="diff-header">
                    <span className="diff-label">Easy</span>
                    <span className="diff-count">{stats.byDifficulty.easy?.solved || 0}/{stats.byDifficulty.easy?.total || 0}</span>
                  </div>
                  <div className="diff-bar">
                    <div 
                      className="diff-fill" 
                      style={{ width: `${stats.byDifficulty.easy?.total ? (stats.byDifficulty.easy.solved / stats.byDifficulty.easy.total) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>
                <div className="difficulty-card medium">
                  <div className="diff-header">
                    <span className="diff-label">Medium</span>
                    <span className="diff-count">{stats.byDifficulty.medium?.solved || 0}/{stats.byDifficulty.medium?.total || 0}</span>
                  </div>
                  <div className="diff-bar">
                    <div 
                      className="diff-fill" 
                      style={{ width: `${stats.byDifficulty.medium?.total ? (stats.byDifficulty.medium.solved / stats.byDifficulty.medium.total) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>
                <div className="difficulty-card hard">
                  <div className="diff-header">
                    <span className="diff-label">Hard</span>
                    <span className="diff-count">{stats.byDifficulty.hard?.solved || 0}/{stats.byDifficulty.hard?.total || 0}</span>
                  </div>
                  <div className="diff-bar">
                    <div 
                      className="diff-fill" 
                      style={{ width: `${stats.byDifficulty.hard?.total ? (stats.byDifficulty.hard.solved / stats.byDifficulty.hard.total) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Quick Actions & Recent Activity */}
          <div className="dashboard-grid">
            {/* Quick Actions */}
            <div className="quick-actions-card">
              <h3>Quick Actions</h3>
              <div className="actions-list">
                <Link to="/problems" className="action-item">
                  <div className="action-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                  </div>
                  <span>Add Problem</span>
                </Link>
                <Link to="/bookmarks" className="action-item">
                  <div className="action-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
                    </svg>
                  </div>
                  <span>View Bookmarks</span>
                </Link>
                <Link to="/progress" className="action-item">
                  <div className="action-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
                    </svg>
                  </div>
                  <span>View Analytics</span>
                </Link>
                <Link to="/profile/edit" className="action-item">
                  <div className="action-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125" />
                    </svg>
                  </div>
                  <span>Edit Profile</span>
                </Link>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="recent-activity-card">
              <h3>Recent Problems</h3>
              {recentQuests.length > 0 ? (
                <div className="recent-list">
                  {recentQuests.map((quest) => (
                    <div key={quest._id} className="recent-item">
                      {getStatusIcon(quest.status)}
                      <div className="recent-info">
                        <span className="recent-name">{quest.questNumber}. {quest.questName}</span>
                        <span className="recent-meta">
                          <span className={`difficulty ${quest.difficulty}`}>{quest.difficulty}</span>
                          <span className="platform">{quest.platform}</span>
                        </span>
                      </div>
                      <span className="recent-date">{formatDate(quest.updatedAt)}</span>
                    </div>
                  ))}
                  <Link to="/problems" className="view-all-link">View All Problems →</Link>
                </div>
              ) : (
                <div className="activity-empty">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                  <p>No problems added yet</p>
                  <span>Start adding problems to track your progress</span>
                </div>
              )}
            </div>
          </div>

          {/* Needs Revision Section */}
          {stats?.needsRevision && stats.needsRevision.length > 0 && (
            <div className="revision-section">
              <h3>🔄 Needs Revision</h3>
              <p className="revision-subtitle">Problems you haven't revised in over 7 days</p>
              <div className="revision-list">
                {stats.needsRevision.slice(0, 5).map((quest) => (
                  <a 
                    key={quest._id} 
                    className="revision-item" 
                    href={quest.questLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <span className="revision-name">{quest.questNumber}. {quest.questName}</span>
                    <span className="revision-date">Last revised: {formatDate(quest.lastRevisedAt)}</span>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Weak Areas */}
          {stats?.weakAreas && stats.weakAreas.length > 0 && (
            <div className="weak-areas-section">
              <h3>📊 Focus Areas</h3>
              <p className="weak-subtitle">Topics with less than 50% completion (3+ problems)</p>
              <div className="weak-list">
                {stats.weakAreas.map((area, idx) => (
                  <div key={idx} className="weak-item">
                    <span className="weak-topic">{area.topic}</span>
                    <div className="weak-progress">
                      <div className="weak-bar">
                        <div className="weak-fill" style={{ width: `${area.percentage}%` }}></div>
                      </div>
                      <span className="weak-percent">{area.percentage}%</span>
                    </div>
                    <span className="weak-count">{area.solved}/{area.total}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
