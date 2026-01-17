import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { motion } from 'framer-motion';
import { googleLogin } from '../api/auth';
import { useAuth } from '../context/AuthContext';
import LoginBackgroundCanvas from '../components/LoginBackgroundCanvas';
import './Auth.css';

const Login = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 30 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
    },
  };

  const glowVariants = {
    animate: {
      boxShadow: [
        '0 0 20px rgba(79, 209, 197, 0.2), 0 0 40px rgba(79, 209, 197, 0.1)',
        '0 0 30px rgba(79, 209, 197, 0.3), 0 0 60px rgba(79, 209, 197, 0.15)',
        '0 0 20px rgba(79, 209, 197, 0.2), 0 0 40px rgba(79, 209, 197, 0.1)',
      ],
      transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
    },
  };

  return (
    <div className="wave-auth-container">
      {/* Interactive 3D Background */}
      <LoginBackgroundCanvas />

      {/* Main Content */}
      <div className="wave-auth-content">
        {/* Left Side - Branding */}
        <motion.div
          className="wave-auth-branding"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div className="wave-brand-logo" variants={itemVariants}>
            <div className="wave-logo-icon">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" />
              </svg>
            </div>
            <span className="wave-logo-text">CPCodes</span>
          </motion.div>

          <motion.h1 className="wave-brand-headline" variants={itemVariants}>
            Master Your
            <span className="wave-gradient-text"> Coding Journey</span>
          </motion.h1>

          <motion.p className="wave-brand-description" variants={itemVariants}>
            Track, organize, and conquer your DSA problems. Never lose your progress again.
          </motion.p>

          <motion.div className="wave-feature-list" variants={containerVariants}>
            {[
              { icon: '✓', text: 'Track solved questions' },
              { icon: '★', text: 'Bookmark for revision' },
              { icon: '◎', text: 'Company-wise analytics' },
              { icon: '⚡', text: 'Chrome extension sync' },
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="wave-feature-item"
                variants={itemVariants}
                whileHover={{ x: 10, transition: { duration: 0.2 } }}
              >
                <span className="wave-feature-icon">{feature.icon}</span>
                <span>{feature.text}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Right Side - Glassmorphism Login Card */}
        <motion.div
          className="wave-auth-card-wrapper"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            className="wave-auth-card"
            variants={glowVariants}
            animate="animate"
          >
            {/* Card glow effect */}
            <div className="wave-card-glow" />

            <div className="wave-card-header">
              <h2>Welcome Back</h2>
              <p>Sign in to continue your journey</p>
            </div>

            {error && (
              <motion.div
                className="wave-error-message"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                </svg>
                <span>{error}</span>
              </motion.div>
            )}

            <div className="wave-google-login-wrapper">
              {loading ? (
                <div className="wave-loading-state">
                  <div className="wave-spinner" />
                  <span>Signing you in...</span>
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

            <div className="wave-divider">
              <span>Secure authentication</span>
            </div>

            <div className="wave-benefits">
              <div className="wave-benefit-item">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
                </svg>
                <span>Your data is encrypted</span>
              </div>
              <div className="wave-benefit-item">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15a4.5 4.5 0 0 0 4.5 4.5H18a3.75 3.75 0 0 0 1.332-7.257 3 3 0 0 0-3.758-3.848 5.25 5.25 0 0 0-10.233 2.33A4.502 4.502 0 0 0 2.25 15Z" />
                </svg>
                <span>Sync across devices</span>
              </div>
            </div>

            <p className="wave-auth-terms">
              By signing in, you agree to our{' '}
              <a href="#">Terms of Service</a> and{' '}
              <a href="#">Privacy Policy</a>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
