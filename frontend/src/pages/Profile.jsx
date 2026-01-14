import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getProfile, getQuestStats } from '../api/auth';
import './Profile.css';
import './Dashboard.css';

const Profile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, updateUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      const [profileRes, statsRes] = await Promise.all([
        getProfile(),
        getQuestStats()
      ]);

      if (profileRes.success) {
        setProfile(profileRes.user);
        updateUser(profileRes.user);
      }
      if (statsRes.success) {
        setStats(statsRes.stats);
      }
    } catch (err) {
      setError('Failed to load profile');
      console.error(err);
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
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25Z" />
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

  const overview = stats?.overview || { total: 0, solved: 0, unsolved: 0, forFuture: 0, bookmarked: 0 };
  const completionRate = stats?.completionRate || 0;

  if (loading) {
    return (
      <div className="profile-layout">
        <div className="profile-loading">
          <div className="loading-spinner"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-layout">
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
          <button className="sidebar-toggle" onClick={() => setSidebarCollapsed(!sidebarCollapsed)}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
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
              {profile?.picture ? (
                <img src={profile.picture} alt={profile.name} />
              ) : (
                <span>{profile?.name?.charAt(0).toUpperCase()}</span>
              )}
            </div>
            {!sidebarCollapsed && (
              <div className="user-details">
                <span className="user-name">{profile?.name}</span>
                <span className="user-email">{profile?.email}</span>
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
      <main className="profile-main">
        {/* Profile Header Banner */}
        <div className="profile-banner">
          {profile?.coverImage ? (
            <div className="banner-cover-image" style={{ backgroundImage: `url(${profile.coverImage})` }}></div>
          ) : (
            <>
              <div className="banner-gradient"></div>
              <div className="banner-pattern"></div>
            </>
          )}
          
          {/* Centered Avatar */}
          <div className="banner-avatar-wrapper">
            <div className="profile-avatar-large">
              {profile?.picture ? (
                <img src={profile.picture} alt={profile.name} />
              ) : (
                <div className="avatar-placeholder-large">
                  {profile?.name?.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="avatar-ring"></div>
            </div>
          </div>

          {/* Edit Button */}
          <Link to="/profile/edit" className="edit-profile-btn">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
            </svg>
            Edit Profile
          </Link>
        </div>

        {/* Profile Info Section Below Banner */}
        <div className="profile-info-section">
          <h1>{profile?.name}</h1>
          <p className="username">@{profile?.username}</p>
          <div className="profile-badges">
            <span className="badge badge-pro">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
              </svg>
              Active Coder
            </span>
            {completionRate >= 50 && (
              <span className="badge badge-streak">🎯 {completionRate}% Complete</span>
            )}
          </div>
        </div>

        {/* Profile Content */}
        <div className="profile-content">
          {/* Stats Cards */}
          <div className="profile-stats-grid">
            <div className="profile-stat-card">
              <div className="stat-icon solved">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
              </div>
              <div className="stat-details">
                <span className="stat-number">{overview.solved}</span>
                <span className="stat-label">Problems Solved</span>
              </div>
            </div>

            <div className="profile-stat-card">
              <div className="stat-icon bookmarked">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
                </svg>
              </div>
              <div className="stat-details">
                <span className="stat-number">{overview.bookmarked}</span>
                <span className="stat-label">Bookmarked</span>
              </div>
            </div>

            <div className="profile-stat-card">
              <div className="stat-icon total">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 0 1 0 3.75H5.625a1.875 1.875 0 0 1 0-3.75Z" />
                </svg>
              </div>
              <div className="stat-details">
                <span className="stat-number">{overview.total}</span>
                <span className="stat-label">Total Problems</span>
              </div>
            </div>

            <div className="profile-stat-card">
              <div className="stat-icon accuracy">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" />
                </svg>
              </div>
              <div className="stat-details">
                <span className="stat-number">{completionRate}%</span>
                <span className="stat-label">Completion Rate</span>
              </div>
            </div>
          </div>

          {/* Two Column Layout */}
          <div className="profile-grid">
            {/* Left Column */}
            <div className="profile-left">
              {/* About Card */}
              <div className="profile-card">
                <div className="card-header">
                  <h3>About</h3>
                </div>
                <div className="card-body">
                  {profile?.bio ? (
                    <p className="bio-text">{profile.bio}</p>
                  ) : (
                    <p className="bio-empty">No bio added yet. Click edit to add one!</p>
                  )}
                  
                  <div className="profile-details-list">
                    <div className="detail-item">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                      </svg>
                      <span>{profile?.email}</span>
                    </div>
                    <div className="detail-item">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                      </svg>
                      <span>Joined {new Date(profile?.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                    </div>
                    <div className="detail-item">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                      </svg>
                      <span>@{profile?.username}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress Ring Card */}
              <div className="profile-card">
                <div className="card-header">
                  <h3>Overall Progress</h3>
                </div>
                <div className="card-body">
                  <div className="progress-ring-container">
                    <div className="progress-ring">
                      <svg viewBox="0 0 100 100">
                        <circle className="progress-ring-bg" cx="50" cy="50" r="42" />
                        <circle 
                          className="progress-ring-fill" 
                          cx="50" 
                          cy="50" 
                          r="42" 
                          strokeDasharray="264" 
                          strokeDashoffset={264 - (264 * completionRate / 100)} 
                        />
                      </svg>
                      <div className="progress-ring-text">
                        <span className="progress-value">{completionRate}%</span>
                        <span className="progress-label">Complete</span>
                      </div>
                    </div>
                    <div className="progress-details">
                      <div className="progress-item">
                        <span className="progress-dot green"></span>
                        <span>{overview.solved}/{overview.total} Solved</span>
                      </div>
                      <div className="progress-item">
                        <span className="progress-dot blue"></span>
                        <span>{overview.forFuture} For Future</span>
                      </div>
                      <div className="progress-item">
                        <span className="progress-dot yellow"></span>
                        <span>{overview.bookmarked} Bookmarked</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="profile-right">
              {/* Difficulty Breakdown */}
              {stats?.byDifficulty && (
                <div className="profile-card">
                  <div className="card-header">
                    <h3>Difficulty Breakdown</h3>
                  </div>
                  <div className="card-body">
                    <div className="difficulty-breakdown">
                      <div className="difficulty-row">
                        <span className="diff-label easy">Easy</span>
                        <div className="diff-bar-wrapper">
                          <div className="diff-bar">
                            <div 
                              className="diff-fill easy" 
                              style={{ width: `${stats.byDifficulty.easy?.total ? (stats.byDifficulty.easy.solved / stats.byDifficulty.easy.total) * 100 : 0}%` }}
                            ></div>
                          </div>
                        </div>
                        <span className="diff-count">{stats.byDifficulty.easy?.solved || 0}/{stats.byDifficulty.easy?.total || 0}</span>
                      </div>
                      <div className="difficulty-row">
                        <span className="diff-label medium">Medium</span>
                        <div className="diff-bar-wrapper">
                          <div className="diff-bar">
                            <div 
                              className="diff-fill medium" 
                              style={{ width: `${stats.byDifficulty.medium?.total ? (stats.byDifficulty.medium.solved / stats.byDifficulty.medium.total) * 100 : 0}%` }}
                            ></div>
                          </div>
                        </div>
                        <span className="diff-count">{stats.byDifficulty.medium?.solved || 0}/{stats.byDifficulty.medium?.total || 0}</span>
                      </div>
                      <div className="difficulty-row">
                        <span className="diff-label hard">Hard</span>
                        <div className="diff-bar-wrapper">
                          <div className="diff-bar">
                            <div 
                              className="diff-fill hard" 
                              style={{ width: `${stats.byDifficulty.hard?.total ? (stats.byDifficulty.hard.solved / stats.byDifficulty.hard.total) * 100 : 0}%` }}
                            ></div>
                          </div>
                        </div>
                        <span className="diff-count">{stats.byDifficulty.hard?.solved || 0}/{stats.byDifficulty.hard?.total || 0}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Top Topics */}
              {stats?.byTopic && stats.byTopic.length > 0 && (
                <div className="profile-card">
                  <div className="card-header">
                    <h3>Top Topics</h3>
                  </div>
                  <div className="card-body">
                    <div className="topics-list-profile">
                      {stats.byTopic.slice(0, 6).map((topic, idx) => (
                        <div key={idx} className="topic-item">
                          <span className="topic-name">{topic.topic}</span>
                          <div className="topic-progress">
                            <div className="topic-bar">
                              <div 
                                className="topic-fill" 
                                style={{ width: `${topic.percentage}%` }}
                              ></div>
                            </div>
                            <span className="topic-stats">{topic.solved}/{topic.total}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
