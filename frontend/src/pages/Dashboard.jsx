import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getQuestStats, getQuests } from '../api/auth';
import DashboardHeroArt from '../components/DashboardHeroArt';
import './Dashboard.css';

const navItems = [
  { path: '/dashboard', icon: 'home', label: 'Dashboard' },
  { path: '/problems', icon: 'problems', label: 'Problems' },
  { path: '/analytics', icon: 'contest', label: 'Contests' },
  { path: '/bookmarks', icon: 'bookmark', label: 'Bookmarks' },
  { path: '/analytics', icon: 'analytics', label: 'Analytics' },
  { path: '/dashboard', icon: 'streak', label: 'Streaks' },
  { path: '/dashboard', icon: 'notes', label: 'Notes' },
  { path: '/profile', icon: 'profile', label: 'Profile' },
  { path: '/profile/edit', icon: 'settings', label: 'Settings' },
];

const quickActions = [
  { to: '/problems', icon: 'plus', label: 'Add Problem', detail: 'Practice new problem' },
  { to: '/bookmarks', icon: 'bookmark', label: 'View Bookmarks', detail: 'Go to saved problems' },
  { to: '/problems', icon: 'topics', label: 'Topic Practice', detail: 'Practice by topic' },
  { to: '/analytics', icon: 'trophy', label: 'Contests', detail: 'Join coding contests' },
];

const statMeta = [
  { key: 'solved', label: 'Problems Solved', accent: 'green', hint: '+15% vs last 7 days', icon: 'check' },
  { key: 'total', label: 'Total Problems', accent: 'violet', hint: 'Across all topics', icon: 'stack' },
  { key: 'bookmarked', label: 'Bookmarked', accent: 'amber', hint: 'Problems saved', icon: 'bookmark' },
  { key: 'topics', label: 'Topics Covered', accent: 'blue', hint: 'Keep exploring', icon: 'tag' },
];

const difficultyTheme = {
  easy: { label: 'Easy', color: '#22c55e', glow: 'rgba(34, 197, 94, 0.25)' },
  medium: { label: 'Medium', color: '#fbbf24', glow: 'rgba(251, 191, 36, 0.25)' },
  hard: { label: 'Hard', color: '#ef4444', glow: 'rgba(239, 68, 68, 0.25)' },
};

const getRelativeDayLabel = (date) => date.toLocaleDateString('en-US', { weekday: 'short' });

const formatDate = (dateString) => {
  if (!dateString) return 'Never';
  const date = new Date(dateString);
  const now = new Date();
  const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString();
};

const formatCompactDate = (date) => date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

const getStatusClass = (status) => {
  if (status === 'solved') return 'solved';
  if (status === 'for-future') return 'for-future';
  return 'unsolved';
};

const getIcon = (iconName) => {
  const icons = {
    home: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="m3 10.5 9-7.5 9 7.5V21a1 1 0 0 1-1 1h-5.5v-6.5A1.5 1.5 0 0 0 13 14H11a1.5 1.5 0 0 0-1.5 1.5V22H4a1 1 0 0 1-1-1V10.5Z" /></svg>
    ),
    problems: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75" /><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
    ),
    bookmark: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M17.5 3.5a1.5 1.5 0 0 1 1.5 1.5v15.2l-7-3.7-7 3.7V5a1.5 1.5 0 0 1 1.5-1.5h11Z" /></svg>
    ),
    analytics: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5h15" /><path strokeLinecap="round" strokeLinejoin="round" d="M7.5 16.5v-5" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5v-9" /><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 16.5v-7" /></svg>
    ),
    contest: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M8 3.75h8v2.5A4 4 0 0 1 12 10.25a4 4 0 0 1-4-4v-2.5Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M9 10.25H7.5A3.5 3.5 0 0 1 4 6.75V5.5h4.2" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.25h1.5A3.5 3.5 0 0 0 20 6.75V5.5h-4.2" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 10.25v4.5" /><path strokeLinecap="round" strokeLinejoin="round" d="M9 21h6" /></svg>
    ),
    streak: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 2.25c-.9 2.4-3.6 4.05-3.6 7.05 0 1.95 1.08 3 1.08 3s-4.23 0-4.23 4.5a6.75 6.75 0 0 0 13.5 0c0-4.2-3.15-6.6-3.15-10.05 0-1.65-.93-3.15-1.6-4.5Z" /></svg>
    ),
    notes: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M7.5 3.75h9A2.25 2.25 0 0 1 18.75 6v12A2.25 2.25 0 0 1 16.5 20.25h-9A2.25 2.25 0 0 1 5.25 18V6A2.25 2.25 0 0 1 7.5 3.75Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M8.75 8.5h6.5M8.75 12h6.5M8.75 15.5h4" /></svg>
    ),
    profile: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 7.5a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 20.25a7.5 7.5 0 0 1 15 0" /></svg>
    ),
    settings: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8.25a3.75 3.75 0 1 0 0 7.5 3.75 3.75 0 0 0 0-7.5Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12a7.33 7.33 0 0 0-.12-1.33l1.82-1.38-1.87-3.24-2.15.73a7.46 7.46 0 0 0-2.31-1.34L14.5 2.5h-5L8.8 5.44A7.46 7.46 0 0 0 6.48 6.78l-2.15-.73-1.87 3.24 1.82 1.38A7.33 7.33 0 0 0 4.5 12c0 .45.04.89.12 1.33L2.8 14.71l1.87 3.24 2.15-.73a7.46 7.46 0 0 0 2.31 1.34L9.5 21.5h5l.72-2.94a7.46 7.46 0 0 0 2.31-1.34l2.15.73 1.87-3.24-1.82-1.38c.08-.44.12-.88.12-1.33Z" /></svg>
    ),
    plus: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14M5 12h14" /></svg>
    ),
    topics: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M6 7.5h12M6 12h12M6 16.5h12" /><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 7.5h.01M4.5 12h.01M4.5 16.5h.01" /></svg>
    ),
    trophy: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5h7.5v2.25a3.75 3.75 0 0 1-7.5 0V4.5Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M5.5 5.5h2.75v1A4.75 4.75 0 0 1 3.5 11.25h-.75V9.5A4 4 0 0 1 5.5 5.5ZM18.5 5.5h-2.75v1a4.75 4.75 0 0 0 4.75 4.75h.75V9.5a4 4 0 0 0-2.75-4Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 13.5v2.25M9 20.25h6" /></svg>
    ),
    tag: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.75H5.5A1.75 1.75 0 0 0 3.75 5.5v4.25c0 .46.18.9.51 1.23l8.76 8.76a1.75 1.75 0 0 0 2.47 0l4.25-4.25a1.75 1.75 0 0 0 0-2.47l-8.76-8.76a1.75 1.75 0 0 0-1.23-.51Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h.01" /></svg>
    ),
    chevron: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="m9 18 6-6-6-6" /></svg>
    ),
    bell: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M15 17.25H9M19.5 17.25H4.5c1.25-1.25 2.25-2.5 2.25-4.5v-1.5A5.25 5.25 0 0 1 12 6V5.25a1.5 1.5 0 0 1 3 0V6a5.25 5.25 0 0 1 5.25 5.25v1.5c0 2 1 3.25 2.25 4.5Z" /></svg>
    ),
    moon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 15.25A8.5 8.5 0 0 1 8.75 3.75a7.25 7.25 0 1 0 11.5 11.5Z" /></svg>
    ),
    search: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-4.2-4.2m1.2-4.8a6 6 0 1 1-12 0 6 6 0 0 1 12 0Z" /></svg>
    ),
    calendar: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M7.5 3.75v2.25M16.5 3.75v2.25M4.5 8.25h15" /><path strokeLinecap="round" strokeLinejoin="round" d="M6 5.25h12A1.5 1.5 0 0 1 19.5 6.75v11.25A1.5 1.5 0 0 1 18 19.5H6a1.5 1.5 0 0 1-1.5-1.5V6.75A1.5 1.5 0 0 1 6 5.25Z" /></svg>
    ),
    menu: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 6h15M4.5 12h15M4.5 18h15" /></svg>
    ),
    logout: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 5.25H7.5A2.25 2.25 0 0 0 5.25 7.5v9A2.25 2.25 0 0 0 7.5 18.75h3" /><path strokeLinecap="round" strokeLinejoin="round" d="M14.25 8.25 18.75 12l-4.5 3.75" /><path strokeLinecap="round" strokeLinejoin="round" d="M18.75 12H9" /></svg>
    ),
    stack: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 7.5 12 3.75l7.5 3.75-7.5 3.75-7.5-3.75Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12l7.5 3.75 7.5-3.75" /><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 16.5 12 20.25l7.5-3.75" /></svg>
    ),
    check: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75" /><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
    ),
  };

  return icons[iconName];
};

const Sparkline = ({ values, color }) => {
  const width = 120;
  const height = 40;
  const padding = 4;
  const max = Math.max(...values, 1);
  const min = Math.min(...values);
  const range = Math.max(max - min, 1);
  const points = values.map((value, index) => {
    const x = padding + (index * (width - padding * 2)) / (values.length - 1);
    const y = height - padding - ((value - min) / range) * (height - padding * 2);
    return `${x},${y}`;
  });

  return (
    <svg className="sparkline" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
      <polyline fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" points={points.join(' ')} />
    </svg>
  );
};

const ringPercent = (solved, total) => (total > 0 ? Math.round((solved / total) * 100) : 0);

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [stats, setStats] = useState(null);
  const [recentQuests, setRecentQuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchValue, setSearchValue] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, questsRes] = await Promise.all([
          getQuestStats(),
          getQuests({ limit: 5, sortBy: 'updatedAt', sortOrder: 'desc' }),
        ]);

        if (statsRes.success) setStats(statsRes.stats);
        if (questsRes.success) setRecentQuests(questsRes.quests);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const overview = stats?.overview || { total: 0, solved: 0, unsolved: 0, forFuture: 0, bookmarked: 0 };
  const topicCount = stats?.byTopic?.length || 0;
  const completionRate = stats?.completionRate || 0;
  const currentDateLabel = formatCompactDate(new Date());

  const weeklyChart = useMemo(() => {
    const activityMap = new Map((stats?.recentActivity || []).map((item) => [item._id, item.count]));
    const dates = Array.from({ length: 7 }, (_, index) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - index));
      return date;
    });

    const labels = dates.map((date) => getRelativeDayLabel(date));
    const values = dates.map((date) => activityMap.get(date.toISOString().slice(0, 10)) || 0);
    const max = Math.max(5, ...values);
    const width = 420;
    const height = 180;
    const paddingX = 20;
    const paddingY = 18;
    const usableWidth = width - paddingX * 2;
    const usableHeight = height - paddingY * 2;

    const points = values.map((value, index) => {
      const x = paddingX + (index * usableWidth) / (values.length - 1);
      const y = height - paddingY - (value / max) * usableHeight;
      return { x, y };
    });

    const linePath = points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ');
    const areaPath = `${linePath} L ${points[points.length - 1].x} ${height - paddingY} L ${points[0].x} ${height - paddingY} Z`;

    return { labels, values, points, linePath, areaPath };
  }, [stats]);

  const difficultyCards = useMemo(() => {
    const source = stats?.byDifficulty || {};
    return Object.entries(difficultyTheme).map(([key, theme]) => {
      const total = source[key]?.total || 0;
      const solved = source[key]?.solved || 0;
      return { key, ...theme, total, solved, percent: ringPercent(solved, total) };
    });
  }, [stats]);

  const statCards = useMemo(() => {
    const accentMap = { green: '#22c55e', violet: '#8b5cf6', amber: '#f59e0b', blue: '#3b82f6' };
    return statMeta.map((item, index) => {
      const valueByKey = {
        solved: overview.solved,
        total: overview.total,
        bookmarked: overview.bookmarked,
        topics: topicCount,
      };

      const values = [index + 2, index + 4, index + 3, index + 6, index + 5, index + 8, index + 9];

      return {
        ...item,
        value: valueByKey[item.key] || 0,
        color: accentMap[item.accent],
        trend: values.map((n) => n + (item.key === 'total' ? 3 : item.key === 'bookmarked' ? 1 : 0)),
      };
    });
  }, [overview.bookmarked, overview.solved, overview.total, topicCount]);

  const handleSearchKeyDown = (event) => {
    if (event.key === 'Enter') navigate('/problems');
  };

  return (
    <div className="dashboard-layout">
      <aside className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <div className="brand-mark">CP</div>
            {!sidebarCollapsed && <span className="brand-name">Tracker</span>}
          </div>
          <button className="sidebar-toggle" onClick={() => setSidebarCollapsed((value) => !value)} aria-label="Toggle sidebar">
            {getIcon('menu')}
          </button>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <Link key={`${item.label}-${item.path}`} to={item.path} className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}>
              <span className="nav-icon">{getIcon(item.icon)}</span>
              {!sidebarCollapsed && <span className="nav-label">{item.label}</span>}
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="profile-card">
            <div className="user-avatar">
              {user?.picture ? <img src={user.picture} alt={user.name} /> : <span>{user?.name?.charAt(0)?.toUpperCase() || 'U'}</span>}
            </div>
            {!sidebarCollapsed && (
              <div className="user-copy">
                <div className="user-topline">
                  <span className="user-name">{user?.name?.split(' ')[0] || 'User'}</span>
                  <span className="pro-pill">Pro</span>
                </div>
                <span className="user-email">{user?.email}</span>
              </div>
            )}
          </div>

          <div className="sidebar-metrics">
            <div className="streak-card">
              <div className="streak-icon">🔥</div>
              {!sidebarCollapsed && (
                <div>
                  <span className="streak-label">Current Streak</span>
                  <strong>{stats?.currentStreak || 17} days</strong>
                  <span className="streak-note">Keep it up!</span>
                </div>
              )}
            </div>
            <button className="logout-btn" onClick={handleLogout} title="Logout" aria-label="Logout">
              {getIcon('logout')}
            </button>
          </div>
        </div>
      </aside>

      <main className="main-content">
        <header className="content-header">
          <div className="header-copy">
            <h1>Dashboard <span className="header-spark">✦</span></h1>
            <p>Track your coding progress and improve each day.</p>
          </div>

          <div className="header-actions">
            <label className="search-box">
              <span className="search-icon">{getIcon('search')}</span>
              <input value={searchValue} onChange={(event) => setSearchValue(event.target.value)} onKeyDown={handleSearchKeyDown} placeholder="Search problems, topics..." aria-label="Search problems or topics" />
              <kbd>⌘ K</kbd>
            </label>

            <button className="icon-chip" type="button" aria-label="Notifications">
              {getIcon('bell')}
              <span className="notification-badge">3</span>
            </button>

            <button className="icon-chip" type="button" aria-label="Theme toggle">
              {getIcon('moon')}
            </button>

            <div className="date-chip">
              <div className="date-icon">{getIcon('calendar')}</div>
              <div>
                <strong>{currentDateLabel}</strong>
                <span>Good evening, {user?.name?.split(' ')[0] || 'Ravi'}! 👋</span>
              </div>
            </div>
          </div>
        </header>

        <div className="dashboard-content">
          <section className="hero-card">
            <div className="hero-copy">
              <p className="hero-kicker">Welcome back, {user?.name?.split(' ')[0] || 'User'}! 👋</p>
              <h2>{loading ? 'Loading your progress...' : `You've solved ${overview.solved} out of ${overview.total} problems.`}</h2>
              <p className="hero-text">
                {overview.total === 0 ? 'Start building your problem-solving streak with your first tracked question.' : `You're at ${completionRate}% completion. Keep the momentum going with focused practice and revision.`}
              </p>

              <div className="hero-actions-row">
                <Link to="/problems" className="primary-cta">
                  Continue Solving
                  <span>{getIcon('chevron')}</span>
                </Link>
                <div className="hero-metric-pills">
                  <span>{overview.solved} solved</span>
                  <span>{overview.bookmarked} saved</span>
                  <span>{topicCount} topics</span>
                </div>
              </div>
            </div>

            <div className="hero-visual">
              <DashboardHeroArt />
              <div className="hero-floating-badge check">✓</div>
              <div className="hero-floating-badge braces">{'{}'}</div>
              <div className="hero-floating-badge trophy">🏆</div>
            </div>
          </section>

          <section className="stats-grid">
            {statCards.map((card) => (
              <article key={card.key} className={`stat-card ${card.key}`}>
                <div className="stat-card-top">
                  <div className={`stat-icon ${card.accent}`}>{getIcon(card.icon)}</div>
                  <div className="stat-main-copy">
                    <strong>{loading ? '...' : card.value}</strong>
                    <span>{card.label}</span>
                    <small>{card.hint}</small>
                  </div>
                </div>
                <Sparkline values={card.trend} color={card.color} />
              </article>
            ))}
          </section>

          <section className="middle-grid">
            <article className="panel-card difficulty-card-shell">
              <div className="panel-head">
                <h3>Difficulty Breakdown</h3>
                <button type="button" className="ghost-chip">This Month</button>
              </div>

              <div className="difficulty-grid">
                {difficultyCards.map((item) => (
                  <div key={item.key} className={`difficulty-card ${item.key}`}>
                    <div className="difficulty-ring" style={{ background: `conic-gradient(${item.color} ${item.percent * 3.6}deg, rgba(255, 255, 255, 0.08) 0deg)`, boxShadow: `0 0 32px ${item.glow}` }}>
                      <div className="difficulty-ring-inner">
                        <strong>{item.percent}%</strong>
                        <span>{item.solved}/{item.total || 0}</span>
                      </div>
                    </div>
                    <div className="difficulty-copy">
                      <strong>{item.label}</strong>
                      <span>{item.key === 'easy' ? 'Keep practicing!' : item.key === 'medium' ? 'Good progress!' : 'Almost there!'}</span>
                    </div>
                  </div>
                ))}
              </div>
            </article>

            <article className="panel-card chart-card-shell">
              <div className="panel-head">
                <h3>Weekly Progress</h3>
                <button type="button" className="ghost-chip">This Week</button>
              </div>

              <div className="weekly-chart-wrap">
                <svg className="weekly-chart" viewBox="0 0 420 180" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="weeklyFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.35" />
                      <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <g className="chart-grid-lines">
                    <line x1="18" y1="28" x2="402" y2="28" />
                    <line x1="18" y1="74" x2="402" y2="74" />
                    <line x1="18" y1="120" x2="402" y2="120" />
                    <line x1="18" y1="166" x2="402" y2="166" />
                  </g>
                  <path d={weeklyChart.areaPath} fill="url(#weeklyFill)" />
                  <path d={weeklyChart.linePath} fill="none" stroke="#a855f7" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                  {weeklyChart.points.map((point, index) => <circle key={`${weeklyChart.labels[index]}-${index}`} cx={point.x} cy={point.y} r="4.5" fill="#f5f3ff" stroke="#7c3aed" strokeWidth="2" />)}
                  <g className="chart-axis-labels">
                    {weeklyChart.labels.map((label, index) => {
                      const x = 20 + (index * 380) / (weeklyChart.labels.length - 1);
                      return <text key={label} x={x} y="176" textAnchor="middle">{label}</text>;
                    })}
                  </g>
                </svg>

                <div className="chart-summary-card">
                  <strong>{weeklyChart.values.reduce((sum, value) => sum + value, 0)}</strong>
                  <span>Problems Solved</span>
                </div>

                <div className="chart-tooltip-preview">
                  <strong>{weeklyChart.values[weeklyChart.values.length - 1] || 0}</strong>
                  <span>Problems Solved</span>
                </div>
              </div>
            </article>
          </section>

          <section className="bottom-grid">
            <article className="panel-card quick-actions-card">
              <div className="panel-head panel-head-tight">
                <h3>Quick Actions</h3>
              </div>
              <div className="quick-actions-grid">
                {quickActions.map((action) => (
                  <Link key={action.label} to={action.to} className="quick-action-card">
                    <span className="quick-action-icon">{getIcon(action.icon)}</span>
                    <strong>{action.label}</strong>
                    <span>{action.detail}</span>
                    <em>{getIcon('chevron')}</em>
                  </Link>
                ))}
              </div>
            </article>

            <article className="panel-card recent-card">
              <div className="panel-head">
                <h3>Recent Problems</h3>
                <Link to="/problems" className="view-all-link">View All {getIcon('chevron')}</Link>
              </div>

              {recentQuests.length > 0 ? (
                <div className="recent-list">
                  {recentQuests.map((quest) => (
                    <div key={quest._id} className="recent-item">
                      <span className={`status-dot ${getStatusClass(quest.status)}`} />
                      <div className="recent-copy">
                        <div className="recent-title-row">
                          <strong>{quest.questNumber}. {quest.questName}</strong>
                          <span className={`recent-status ${getStatusClass(quest.status)}`}>{quest.status === 'solved' ? 'Accepted' : quest.status === 'for-future' ? 'Saved' : 'Attempted'}</span>
                        </div>
                        <div className="recent-meta-row">
                          <span className={`difficulty-pill ${quest.difficulty}`}>{quest.difficulty}</span>
                          <span className="topic-pill">{quest.platform}</span>
                        </div>
                      </div>
                      <div className="recent-side">
                        <span className="recent-date">{formatDate(quest.updatedAt)}</span>
                        <button type="button" className="arrow-btn" aria-label={`Open ${quest.questName}`}>{getIcon('chevron')}</button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="activity-empty">
                  <div className="empty-badge">⌛</div>
                  <p>No problems added yet</p>
                  <span>Start adding problems to track your progress</span>
                </div>
              )}
            </article>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;