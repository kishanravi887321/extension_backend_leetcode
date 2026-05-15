import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { disableTwoFactor, enableTwoFactor, getProfile, getQuestStats } from '../api/auth';
import './Profile.css';

const statMeta = [
  { key: 'solved', label: 'Problems Solved', accent: 'green', icon: 'check' },
  { key: 'bookmarked', label: 'Bookmarked', accent: 'amber', icon: 'bookmark' },
  { key: 'total', label: 'Total Problems', accent: 'violet', icon: 'stack' },
  { key: 'completionRate', label: 'Completion Rate', accent: 'blue', icon: 'chart' },
];

const getIcon = (iconName) => {
  const icons = {
    back: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="m15 19.5-7.5-7.5 7.5-7.5" /></svg>
    ),
    edit: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125" /></svg>
    ),
    check: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75" /><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
    ),
    bookmark: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9"><path strokeLinecap="round" strokeLinejoin="round" d="M17.5 3.5a1.5 1.5 0 0 1 1.5 1.5v15.2l-7-3.7-7 3.7V5a1.5 1.5 0 0 1 1.5-1.5h11Z" /></svg>
    ),
    stack: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 7.5 12 3.75l7.5 3.75-7.5 3.75-7.5-3.75Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12l7.5 3.75 7.5-3.75" /><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 16.5 12 20.25l7.5-3.75" /></svg>
    ),
    chart: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5h15" /><path strokeLinecap="round" strokeLinejoin="round" d="M7.5 16.5v-5" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5v-9" /><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 16.5v-7" /></svg>
    ),
    mail: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path strokeLinecap="round" strokeLinejoin="round" d="M3 6.75h18v10.5H3z" /><path strokeLinecap="round" strokeLinejoin="round" d="m3 7.5 9 6 9-6" /></svg>
    ),
    calendar: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path strokeLinecap="round" strokeLinejoin="round" d="M7.5 3.75v2.25M16.5 3.75v2.25M4.5 8.25h15" /><path strokeLinecap="round" strokeLinejoin="round" d="M6 5.25h12A1.5 1.5 0 0 1 19.5 6.75v11.25A1.5 1.5 0 0 1 18 19.5H6a1.5 1.5 0 0 1-1.5-1.5V6.75A1.5 1.5 0 0 1 6 5.25Z" /></svg>
    ),
    user: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 7.5a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 20.25a7.5 7.5 0 0 1 15 0" /></svg>
    ),
    shield: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3.75 19.5 6v5.25c0 4.95-3.05 8.7-7.5 10.5-4.45-1.8-7.5-5.55-7.5-10.5V6L12 3.75Z" /></svg>
    ),
  };

  return icons[iconName];
};

const formatJoined = (dateString) => {
  if (!dateString) return 'Joined recently';
  const date = new Date(dateString);
  return `Joined ${date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`;
};

const Profile = () => {
  const navigate = useNavigate();
  const { user, logout, updateUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [twoFaLoading, setTwoFaLoading] = useState(false);
  const [disableLoading, setDisableLoading] = useState(false);
  const [twoFaError, setTwoFaError] = useState('');
  const [twoFaMessage, setTwoFaMessage] = useState('');
  const [twoFaQrCode, setTwoFaQrCode] = useState('');
  const [showDisableConfirm, setShowDisableConfirm] = useState(false);
  const [showRegenerateConfirm, setShowRegenerateConfirm] = useState(false);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const [profileRes, statsRes] = await Promise.all([getProfile(), getQuestStats()]);
        if (profileRes.success) {
          setProfile(profileRes.user);
          updateUser(profileRes.user);
        }
        if (statsRes.success) setStats(statsRes.stats);
      } catch (error) {
        console.error('Failed to load profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [updateUser]);

  const overview = stats?.overview || { total: 0, solved: 0, bookmarked: 0, forFuture: 0 };
  const completionRate = stats?.completionRate || 0;
  const topTopics = useMemo(() => (stats?.byTopic || []).slice(0, 6), [stats]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleEnableTwoFactor = async () => {
    setTwoFaError('');
    setTwoFaMessage('');
    setTwoFaQrCode('');
    setShowDisableConfirm(false);
    setShowRegenerateConfirm(false);
    setTwoFaLoading(true);

    try {
      const response = await enableTwoFactor();
      if (response.success) {
        setTwoFaQrCode(response.qrCodeDataURL);
        setTwoFaMessage(response.message || '2FA enabled successfully.');
        if (profile) {
          const nextProfile = { ...profile, twoFactorEnabled: true };
          setProfile(nextProfile);
          updateUser(nextProfile);
        }
      } else {
        setTwoFaError(response.message || 'Failed to enable 2FA.');
      }
    } catch (error) {
      setTwoFaError(error.response?.data?.message || 'Failed to enable 2FA.');
    } finally {
      setTwoFaLoading(false);
    }
  };

  const handleDisableTwoFactor = async () => {
    setTwoFaError('');
    setTwoFaMessage('');
    setTwoFaQrCode('');
    setDisableLoading(true);

    try {
      const response = await disableTwoFactor();
      if (response.success) {
        setTwoFaMessage(response.message || '2FA disabled successfully.');
        setShowDisableConfirm(false);
        if (profile) {
          const nextProfile = { ...profile, twoFactorEnabled: false };
          setProfile(nextProfile);
          updateUser(nextProfile);
        }
      } else {
        setTwoFaError(response.message || 'Failed to disable 2FA.');
      }
    } catch (error) {
      setTwoFaError(error.response?.data?.message || 'Failed to disable 2FA.');
    } finally {
      setDisableLoading(false);
    }
  };

  const statsCards = useMemo(() => {
    const map = {
      solved: overview.solved,
      bookmarked: overview.bookmarked,
      total: overview.total,
      completionRate,
    };

    const accentMap = {
      green: '#22c55e',
      amber: '#f59e0b',
      violet: '#8b5cf6',
      blue: '#3b82f6',
    };

    return statMeta.map((item, index) => ({
      ...item,
      value: map[item.key] || 0,
      color: accentMap[item.accent],
      trend: [index + 3, index + 5, index + 4, index + 7, index + 6],
    }));
  }, [completionRate, overview.bookmarked, overview.solved, overview.total]);

  if (loading) {
    return (
      <div className="profile-page profile-loading-page">
        <div className="profile-loading-card">
          <div className="loading-spinner"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-shell">
        <div className="profile-top-actions">
          <Link to="/dashboard" className="profile-back-btn">
            <span>{getIcon('back')}</span>
            Back to Dashboard
          </Link>
          <Link to="/profile/edit" className="profile-edit-btn">
            <span>{getIcon('edit')}</span>
            Edit Profile
          </Link>
        </div>

        <section className="profile-hero">
          {profile?.coverImage ? <div className="profile-hero-cover" style={{ backgroundImage: `url(${profile.coverImage})` }} /> : <div className="profile-hero-cover profile-hero-cover--default" />}
          <div className="profile-hero-overlay" />
          <div className="profile-hero-orbit" />

          <div className="profile-hero-center">
            <div className="profile-avatar-frame">
              <div className="profile-avatar">
                {profile?.picture ? <img src={profile.picture} alt={profile.name} /> : <span>{profile?.name?.charAt(0).toUpperCase() || 'U'}</span>}
              </div>
              <span className={`profile-status-dot ${profile?.twoFactorEnabled ? 'online' : ''}`}></span>
            </div>

            <h1>{profile?.name || user?.name || 'Your Name'}</h1>
            <p className="profile-handle">@{profile?.username || user?.username || 'username'}</p>
            <span className="profile-role-pill">
              <span>⬢</span>
              Active Coder
            </span>
          </div>
        </section>

        <section className="profile-stat-strip">
          {statsCards.map((item) => (
            <article className="profile-stat-card" key={item.key}>
              <div className={`profile-stat-icon ${item.accent}`}>
                {getIcon(item.icon)}
              </div>
              <div className="profile-stat-copy">
                <strong>{item.value}{item.key === 'completionRate' ? '%' : ''}</strong>
                <span>{item.label}</span>
                <small>{item.key === 'solved' ? '+15% vs last 7 days' : item.key === 'bookmarked' ? 'Problems saved' : item.key === 'total' ? 'Across all topics' : 'Keep going'}</small>
              </div>
              <svg className="profile-sparkline" viewBox="0 0 120 40" preserveAspectRatio="none">
                <polyline
                  fill="none"
                  stroke={item.color}
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={item.trend.map((value, index) => `${index * 22 + 4},${28 - value}`).join(' ')}
                />
              </svg>
            </article>
          ))}
        </section>

        <section className="profile-grid">
          <div className="profile-column">
            <article className="profile-panel">
              <div className="profile-panel-header">
                <h2>{getIcon('user')} About</h2>
                <button type="button" className="profile-panel-ghost" onClick={() => navigate('/profile/edit')}>
                  {getIcon('edit')}
                  Add Bio
                </button>
              </div>
              <div className="profile-panel-body">
                <p className="profile-bio">{profile?.bio || 'No bio added yet. Click edit to add one!'}</p>
                <div className="profile-info-list">
                  <div className="profile-info-row">
                    <span>{getIcon('mail')}</span>
                    <strong>{profile?.email || user?.email || 'No email added'}</strong>
                  </div>
                  <div className="profile-info-row">
                    <span>{getIcon('calendar')}</span>
                    <strong>{formatJoined(profile?.createdAt)}</strong>
                  </div>
                  <div className="profile-info-row">
                    <span>{getIcon('user')}</span>
                    <strong>@{profile?.username || user?.username || 'username'}</strong>
                  </div>
                </div>
              </div>
            </article>

            <article className="profile-panel profile-security-panel">
              <div className="profile-panel-header">
                <h2>{getIcon('shield')} Security</h2>
                <span className={`profile-badge ${profile?.twoFactorEnabled ? 'enabled' : 'disabled'}`}>
                  {profile?.twoFactorEnabled ? '2FA Enabled' : '2FA Disabled'}
                </span>
              </div>
              <div className="profile-panel-body">
                <p className="profile-copy">Add an extra layer of protection to your account with a time-based code.</p>
                <div className="profile-actions-row">
                  <button
                    type="button"
                    className="profile-primary-btn"
                    onClick={profile?.twoFactorEnabled ? () => setShowRegenerateConfirm((current) => !current) : handleEnableTwoFactor}
                    disabled={twoFaLoading || disableLoading}
                  >
                    {twoFaLoading
                      ? 'Generating QR...'
                      : profile?.twoFactorEnabled
                        ? showRegenerateConfirm
                          ? 'Cancel regenerate'
                          : 'Regenerate 2FA'
                        : 'Enable 2FA'}
                  </button>
                  {profile?.twoFactorEnabled && (
                    <button
                      type="button"
                      className="profile-secondary-btn"
                      onClick={() => setShowDisableConfirm((current) => !current)}
                      disabled={twoFaLoading || disableLoading}
                    >
                      {showDisableConfirm ? 'Cancel disable' : 'Disable 2FA'}
                    </button>
                  )}
                </div>

                {showRegenerateConfirm && (
                  <div className="profile-warning-box">
                    <p>Regenerating 2FA will invalidate your current authenticator codes.</p>
                    <button type="button" onClick={handleEnableTwoFactor} disabled={twoFaLoading}>
                      {twoFaLoading ? 'Generating...' : 'Confirm regenerate'}
                    </button>
                  </div>
                )}

                {showDisableConfirm && (
                  <div className="profile-warning-box profile-warning-box--danger">
                    <p>Disabling 2FA removes the authenticator requirement for this account.</p>
                    <button type="button" onClick={handleDisableTwoFactor} disabled={disableLoading}>
                      {disableLoading ? 'Disabling...' : 'Confirm disable'}
                    </button>
                  </div>
                )}

                {twoFaError && <p className="profile-feedback profile-feedback--error">{twoFaError}</p>}
                {twoFaMessage && <p className="profile-feedback profile-feedback--success">{twoFaMessage}</p>}
                {twoFaQrCode && (
                  <div className="profile-qr-box">
                    <img src={twoFaQrCode} alt="2FA QR code" />
                    <div>
                      <p>Scan this QR in Google Authenticator, Authy, or Microsoft Authenticator.</p>
                      <button type="button" onClick={() => setTwoFaQrCode('')}>Hide QR</button>
                    </div>
                  </div>
                )}
              </div>
            </article>

            <article className="profile-panel">
              <div className="profile-panel-header">
                <h2>Overall Progress</h2>
              </div>
              <div className="profile-panel-body profile-progress-body">
                <div className="profile-ring">
                  <svg viewBox="0 0 100 100">
                    <circle className="profile-ring-track" cx="50" cy="50" r="42" />
                    <circle
                      className="profile-ring-fill"
                      cx="50"
                      cy="50"
                      r="42"
                      strokeDasharray="264"
                      strokeDashoffset={264 - (264 * completionRate) / 100}
                    />
                  </svg>
                  <div className="profile-ring-text">
                    <strong>{completionRate}%</strong>
                    <span>Complete</span>
                  </div>
                </div>

                <div className="profile-progress-list">
                  <div><span className="profile-dot green" /> <strong>{overview.solved}/{overview.total} Solved</strong></div>
                  <div><span className="profile-dot blue" /> <strong>{overview.forFuture} For Future</strong></div>
                  <div><span className="profile-dot amber" /> <strong>{overview.bookmarked} Bookmarked</strong></div>
                </div>
              </div>
            </article>
          </div>

          <div className="profile-column">
            <article className="profile-panel">
              <div className="profile-panel-header">
                <h2>Difficulty Breakdown</h2>
                <span className="profile-panel-chip">This Month</span>
              </div>
              <div className="profile-panel-body">
                <div className="difficulty-rows">
                  {(['easy', 'medium', 'hard']).map((level) => {
                    const total = stats?.byDifficulty?.[level]?.total || 0;
                    const solved = stats?.byDifficulty?.[level]?.solved || 0;
                    const percent = total ? Math.round((solved / total) * 100) : 0;
                    const theme = level === 'easy' ? 'green' : level === 'medium' ? 'amber' : 'red';

                    return (
                      <div className="difficulty-row" key={level}>
                        <span className={`difficulty-name ${theme}`}>{level.charAt(0).toUpperCase() + level.slice(1)}</span>
                        <div className="difficulty-bar"><span style={{ width: `${percent}%` }} /></div>
                        <strong>{solved}/{total}</strong>
                        <small>{percent}%</small>
                      </div>
                    );
                  })}
                </div>
              </div>
            </article>

            <article className="profile-panel">
              <div className="profile-panel-header">
                <h2>Top Topics</h2>
                <Link to="/analytics" className="profile-panel-link">View All</Link>
              </div>
              <div className="profile-panel-body">
                <div className="topic-list">
                  {topTopics.map((topic) => (
                    <div key={topic.topic} className="topic-row">
                      <div className="topic-name-wrap">
                        <span className="topic-badge" />
                        <strong>{topic.topic}</strong>
                      </div>
                      <div className="topic-bar"><span style={{ width: `${topic.percentage}%` }} /></div>
                      <strong className="topic-count">{topic.solved}/{topic.total}</strong>
                    </div>
                  ))}
                </div>
              </div>
            </article>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Profile;