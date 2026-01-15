import { useState, useEffect, Suspense } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { googleLogin } from '../api/auth';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import WaveBackground from '../components/WaveBackground';
import './CyberLogin.css';

const Login = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleGoogleSuccess = async (credentialResponse) => {
    setError('');
    setLoading(true);

    try {
      const response = await googleLogin(credentialResponse.credential);
      console.log('Login successful:', response);
      await login(response.user, response.extensionToken);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError('Google login failed. Please try again.');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Email/password login not implemented - using Google OAuth
    setError('Please use Google Sign-In to continue');
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 40 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.5 }
    }
  };

  return (
    <div className="cyber-login-container">
      {/* Three.js Wave Background */}
      <Suspense fallback={<div style={{ background: '#000', width: '100%', height: '100vh' }} />}>
        <WaveBackground />
      </Suspense>

      {/* Navigation */}
      <nav className="cyber-nav">
        <div className="cyber-logo">
          <div className="logo-hexagon">
            <svg viewBox="0 0 50 58">
              <polygon 
                className="hex-border" 
                points="25,1 49,15 49,43 25,57 1,43 1,15" 
              />
              <polygon 
                className="hex-fill" 
                points="25,1 49,15 49,43 25,57 1,43 1,15" 
              />
            </svg>
            <div className="logo-inner-circle"></div>
          </div>
        </div>

        <ul className="nav-links">
          <li><a href="#services">Services</a></li>
          <li><a href="#about">About</a></li>
          <li><Link to="/dashboard">Dashboard</Link></li>
          <li><a href="#contact">Contact</a></li>
        </ul>

        <Link to="/dashboard" className="nav-portal">Portal</Link>
      </nav>

      {/* Main Content */}
      <motion.div 
        className="cyber-content"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* AI Badge */}
        <motion.div className="ai-badge" variants={itemVariants}>
          <span className="ai-badge-dot"></span>
          <span>AI-Powered Automation</span>
        </motion.div>

        {/* Main Headline */}
        <motion.div className="cyber-headline" variants={itemVariants}>
          <h1>
            Enterprise IT Solutions
            <span className="neon-text">Reimagined</span>
          </h1>
        </motion.div>

        {/* Tagline */}
        <motion.p className="cyber-tagline" variants={itemVariants}>
          Fully automated AI-powered platform transforming IT operations, 
          security, and innovation at enterprise scale
        </motion.p>

        {/* CTA Buttons */}
        <motion.div className="cyber-cta-buttons" variants={itemVariants}>
          <Link to="/dashboard" className="cyber-btn cyber-btn-primary">
            Explore Services
          </Link>
          <button 
            className="cyber-btn cyber-btn-secondary"
            onClick={() => document.querySelector('.cyber-login-card')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Get Started
          </button>
        </motion.div>

        {/* Login Card */}
        <motion.div className="cyber-login-card" variants={cardVariants}>
          <div className="card-glow"></div>
          
          <div className="cyber-card-header">
            <h2>AI Portal Access</h2>
            <p>Sign in to access your dashboard</p>
          </div>

          {error && (
            <motion.div 
              className="cyber-error"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
              </svg>
              <span>{error}</span>
            </motion.div>
          )}

          <form className="cyber-form" onSubmit={handleSubmit}>
            <div className="cyber-input-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                className="cyber-input"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="cyber-input-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                className="cyber-input"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button type="submit" className="cyber-submit-btn" disabled={loading}>
              {loading ? 'Signing In...' : 'Login'}
            </button>
          </form>

          <div className="cyber-divider">
            <span className="cyber-divider-line"></span>
            <span>or continue with</span>
            <span className="cyber-divider-line"></span>
          </div>

          <div className="cyber-google-wrapper">
            {loading ? (
              <div className="cyber-loading">
                <div className="cyber-spinner"></div>
                <span>Authenticating...</span>
              </div>
            ) : (
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                useOneTap
                theme="filled_black"
                size="large"
                text="continue_with"
                shape="rectangular"
                width="100%"
              />
            )}
          </div>

          <div className="cyber-signup-link">
            <p>Don't have an account? <Link to="/register">Sign Up</Link></p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;
