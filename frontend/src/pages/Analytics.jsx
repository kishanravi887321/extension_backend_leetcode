import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getQuestStats, getHeatmapData, getQuestsGroupedByTopic } from '../api/quests';
import './Dashboard.css'; // For sidebar styles
import './Analytics.css';

const Analytics = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const [stats, setStats] = useState(null);
  const [heatmap, setHeatmap] = useState({});
  const [topicGroups, setTopicGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const menuItems = [
    { path: '/dashboard', icon: 'home', label: 'Dashboard' },
    { path: '/questions', icon: 'problems', label: 'Questions' },
    { path: '/bookmarks', icon: 'bookmark', label: 'Bookmarks' },
    { path: '/analytics', icon: 'progress', label: 'Analytics' },
    { path: '/profile', icon: 'profile', label: 'Profile' },
  ];

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [statsRes, heatmapRes, topicsRes] = await Promise.all([
        getQuestStats(),
        getHeatmapData(selectedYear),
        getQuestsGroupedByTopic()
      ]);

      if (statsRes.success) setStats(statsRes.stats);
      if (heatmapRes.success) setHeatmap(heatmapRes.heatmap);
      if (topicsRes.success) setTopicGroups(topicsRes.topicsList);
    } catch (err) {
      console.error('Error fetching analytics:', err);
    } finally {
      setLoading(false);
    }
  }, [selectedYear]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

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

  // Generate heatmap calendar
  const generateHeatmapCalendar = () => {
    const months = [];
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    for (let month = 0; month < 12; month++) {
      const daysInMonth = new Date(selectedYear, month + 1, 0).getDate();
      const days = [];
      
      for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${selectedYear}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const count = heatmap[dateStr] || 0;
        days.push({ day, count, date: dateStr });
      }
      
      months.push({ name: monthNames[month], days });
    }
    
    return months;
  };

  const getHeatmapColor = (count) => {
    if (count === 0) return 'level-0';
    if (count <= 2) return 'level-1';
    if (count <= 4) return 'level-2';
    if (count <= 6) return 'level-3';
    return 'level-4';
  };

  if (loading) {
    return (
      <div className="analytics-layout">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="analytics-layout">
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
        <header className="content-header">
          <div className="header-left">
            <h1>Analytics</h1>
            <p>Track your progress and identify weak areas</p>
          </div>
        </header>

        <div className="analytics-content">
          {/* Overview Stats */}
          {stats && (
            <div className="analytics-section">
              <h2>Overview</h2>
              <div className="overview-grid">
                <div className="overview-card total">
                  <div className="overview-icon">📊</div>
                  <div className="overview-details">
                    <span className="overview-value">{stats.overview.total}</span>
                    <span className="overview-label">Total Questions</span>
                  </div>
                </div>
                <div className="overview-card solved">
                  <div className="overview-icon">✅</div>
                  <div className="overview-details">
                    <span className="overview-value">{stats.overview.solved}</span>
                    <span className="overview-label">Solved</span>
                  </div>
                </div>
                <div className="overview-card unsolved">
                  <div className="overview-icon">⏳</div>
                  <div className="overview-details">
                    <span className="overview-value">{stats.overview.unsolved}</span>
                    <span className="overview-label">Unsolved</span>
                  </div>
                </div>
                <div className="overview-card completion">
                  <div className="overview-icon">🎯</div>
                  <div className="overview-details">
                    <span className="overview-value">{stats.completionRate}%</span>
                    <span className="overview-label">Completion Rate</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Difficulty Breakdown */}
          {stats && (
            <div className="analytics-section">
              <h2>By Difficulty</h2>
              <div className="difficulty-grid">
                {['easy', 'medium', 'hard'].map(diff => (
                  <div key={diff} className={`difficulty-card ${diff}`}>
                    <h3>{diff.charAt(0).toUpperCase() + diff.slice(1)}</h3>
                    <div className="difficulty-stats">
                      <span className="solved-count">{stats.byDifficulty[diff]?.solved || 0}</span>
                      <span className="total-count">/ {stats.byDifficulty[diff]?.total || 0}</span>
                    </div>
                    <div className="progress-bar">
                      <div 
                        className="progress-fill"
                        style={{ 
                          width: `${stats.byDifficulty[diff]?.total > 0 
                            ? (stats.byDifficulty[diff].solved / stats.byDifficulty[diff].total) * 100 
                            : 0}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Topic Progress */}
          {stats && stats.byTopic.length > 0 && (
            <div className="analytics-section">
              <h2>By Topic</h2>
              <div className="topic-progress-list">
                {stats.byTopic.map(({ topic, total, solved, percentage }) => (
                  <div key={topic} className="topic-progress-item">
                    <div className="topic-info">
                      <span className="topic-name">{topic}</span>
                      <span className="topic-stats">{solved}/{total} ({percentage}%)</span>
                    </div>
                    <div className="progress-bar">
                      <div 
                        className="progress-fill"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Weak Areas */}
          {stats && stats.weakAreas.length > 0 && (
            <div className="analytics-section weak-areas">
              <h2>🎯 Areas to Improve</h2>
              <p className="section-description">Topics with less than 50% completion (minimum 3 questions)</p>
              <div className="weak-areas-grid">
                {stats.weakAreas.map(({ topic, total, solved, percentage }) => (
                  <div key={topic} className="weak-area-card">
                    <span className="weak-topic">{topic}</span>
                    <span className="weak-stats">{solved}/{total} solved ({percentage}%)</span>
                    <Link to={`/questions?topics=${topic}`} className="practice-link">
                      Practice →
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Needs Revision */}
          {stats && stats.needsRevision.length > 0 && (
            <div className="analytics-section revision-section">
              <h2>📅 Needs Revision</h2>
              <p className="section-description">Questions not revised in the last 7 days</p>
              <div className="revision-list">
                {stats.needsRevision.map(q => (
                  <div key={q._id} className="revision-item">
                    <span className="revision-name">#{q.questNumber} - {q.questName}</span>
                    <span className="revision-platform">{q.platform}</span>
                    <a 
                      href={q.questLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="revision-link"
                    >
                      Revise →
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Activity Heatmap */}
          <div className="analytics-section">
            <div className="heatmap-header">
              <h2>Activity Heatmap</h2>
              <select 
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                className="year-selector"
              >
                {[2024, 2025, 2026].map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
            <div className="heatmap-container">
              {generateHeatmapCalendar().map((month, idx) => (
                <div key={idx} className="heatmap-month">
                  <span className="month-label">{month.name}</span>
                  <div className="month-days">
                    {month.days.map((day, dayIdx) => (
                      <div 
                        key={dayIdx}
                        className={`heatmap-day ${getHeatmapColor(day.count)}`}
                        title={`${day.date}: ${day.count} revision${day.count !== 1 ? 's' : ''}`}
                      ></div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="heatmap-legend">
              <span>Less</span>
              <div className="legend-boxes">
                <div className="heatmap-day level-0"></div>
                <div className="heatmap-day level-1"></div>
                <div className="heatmap-day level-2"></div>
                <div className="heatmap-day level-3"></div>
                <div className="heatmap-day level-4"></div>
              </div>
              <span>More</span>
            </div>
          </div>

          {/* Platform Distribution */}
          {stats && Object.keys(stats.byPlatform).length > 0 && (
            <div className="analytics-section">
              <h2>By Platform</h2>
              <div className="platform-grid">
                {Object.entries(stats.byPlatform).map(([platform, data]) => (
                  <div key={platform} className="platform-card">
                    <span className="platform-name">{platform}</span>
                    <span className="platform-stats">{data.solved}/{data.total}</span>
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

export default Analytics;
