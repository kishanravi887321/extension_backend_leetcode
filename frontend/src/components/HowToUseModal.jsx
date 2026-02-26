import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './HowToUseModal.css';

const HowToUseModal = ({ isOpen, onClose }) => {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      id: 1,
      title: 'Install the Extension',
      icon: '🧩',
      color: '#3b82f6',
      substeps: [
        { icon: '📁', text: 'Clone or Download', detail: 'https://github.com/kishanravi887321/codex.git', link: 'https://github.com/kishanravi887321/codex.git' },
        { icon: '🌐', text: 'Open Chrome Extensions', detail: 'Go to chrome://extensions/', link: 'chrome://extensions/' },
        { icon: '⚙️', text: 'Enable Developer Mode', detail: 'Toggle in top-right corner' },
        { icon: '📦', text: 'Load Unpacked', detail: 'Select the codex folder' },
        { icon: '📌', text: 'Pin Extension', detail: 'Click puzzle icon & pin "Codex"' },
      ],
    },
    {
      id: 2,
      title: 'Connect to CPCoders',
      icon: '🔗',
      color: '#10b981',
      substeps: [
        { icon: '🌐', text: 'Visit CPCoders', detail: 'Go to cp.saksin.online', link: 'https://cp.saksin.online' },
        { icon: '🔐', text: 'Login', detail: 'Sign in with Google' },
        { icon: '🔄', text: 'Refresh Page', detail: 'Auto-sync authentication' },
        { icon: '✅', text: 'Connected!', detail: 'Green checkmark on eye icon' },
      ],
    },
    {
      id: 3,
      title: 'Start Capturing',
      icon: '🚀',
      color: '#8b5cf6',
      substeps: [
        { icon: '📝', text: 'Open a Problem', detail: 'LeetCode, GFG, or InterviewBit', link: 'https://leetcode.com/problemset/all/' },
        { icon: '👁️', text: 'Find Eye Icon', detail: 'Bottom-right floating button' },
        { icon: '👆', text: 'Click to Capture', detail: 'Problem syncs instantly' },
        { icon: '📊', text: 'View Dashboard', detail: 'Check cp.saksin.online/problems', link: 'https://cp.saksin.online/problems' },
      ],
    },
  ];

  const statusIndicators = [
    { animation: '🔵', meaning: 'Ready to capture', color: '#3b82f6' },
    { animation: '✅', meaning: 'Saved successfully', color: '#22c55e' },
    { animation: '🟡', meaning: 'Problem updated', color: '#eab308' },
    { animation: '❌', meaning: 'Error - reconnect', color: '#ef4444' },
    { animation: '💜', meaning: 'On dashboard', color: '#a855f7' },
  ];

  const platforms = [
    { name: 'LeetCode', icon: '🟠', features: ['Name', 'Number', 'Topics', 'Difficulty', 'Status'] },
    { name: 'GeeksForGeeks', icon: '🟢', features: ['Name', 'Topics', 'Difficulty', 'Company Tags'] },
    { name: 'InterviewBit', icon: '🔵', features: ['Name', 'Topics', 'Difficulty', 'Company Tags'] },
  ];

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { type: 'spring', damping: 25, stiffness: 300 }
    },
    exit: { opacity: 0, scale: 0.9, y: 20 },
  };

  const stepItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: { delay: i * 0.1 },
    }),
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="htu-modal-backdrop"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          onClick={onClose}
        >
          <motion.div
            className="htu-modal"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="htu-modal-header">
              <div className="htu-header-content">
                <h2>
                  <span className="htu-header-icon">📖</span>
                  Quick Start Guide
                </h2>
                <p>Get started in less than 2 minutes!</p>
              </div>
              <button className="htu-close-btn" onClick={onClose}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clipRule="evenodd" />
                </svg>
              </button>
            </div>

            {/* Step Navigation */}
            <div className="htu-step-nav">
              {steps.map((step, index) => (
                <button
                  key={step.id}
                  className={`htu-step-btn ${activeStep === index ? 'active' : ''}`}
                  onClick={() => setActiveStep(index)}
                  style={{ '--step-color': step.color }}
                >
                  <span className="htu-step-icon">{step.icon}</span>
                  <span className="htu-step-label">Step {step.id}</span>
                </button>
              ))}
              <button
                className={`htu-step-btn ${activeStep === 3 ? 'active' : ''}`}
                onClick={() => setActiveStep(3)}
                style={{ '--step-color': '#f59e0b' }}
              >
                <span className="htu-step-icon">✨</span>
                <span className="htu-step-label">Features</span>
              </button>
            </div>

            {/* Content Area */}
            <div className="htu-content">
              <AnimatePresence mode="wait">
                {activeStep < 3 ? (
                  <motion.div
                    key={activeStep}
                    className="htu-step-content"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="htu-step-header" style={{ '--step-color': steps[activeStep].color }}>
                      <span className="htu-big-icon">{steps[activeStep].icon}</span>
                      <h3>{steps[activeStep].title}</h3>
                    </div>

                    <div className="htu-substeps">
                      {steps[activeStep].substeps.map((substep, i) => (
                        <motion.div
                          key={i}
                          className="htu-substep"
                          custom={i}
                          variants={stepItemVariants}
                          initial="hidden"
                          animate="visible"
                        >
                          <div className="htu-substep-icon" style={{ '--step-color': steps[activeStep].color }}>
                            {substep.icon}
                          </div>
                          <div className="htu-substep-content">
                            <span className="htu-substep-title">{substep.text}</span>
                            <span className="htu-substep-detail">{substep.detail}</span>
                          </div>
                          <div className="htu-substep-number">{i + 1}</div>
                        </motion.div>
                      ))}
                    </div>

                    {activeStep === 0 && (
                      <div className="htu-tip-box">
                        <span className="htu-tip-icon">💡</span>
                        <span>Pin the extension for quick access from your toolbar!</span>
                      </div>
                    )}

                    {activeStep === 1 && (
                      <div className="htu-tip-box success">
                        <span className="htu-tip-icon">🎉</span>
                        <span>Authentication syncs automatically - no extra steps!</span>
                      </div>
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    key="features"
                    className="htu-features-content"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Status Indicators Section */}
                    <div className="htu-section">
                      <h4>
                        <span>🎨</span> Visual Feedback
                      </h4>
                      <div className="htu-status-grid">
                        {statusIndicators.map((status, i) => (
                          <motion.div
                            key={i}
                            className="htu-status-item"
                            custom={i}
                            variants={stepItemVariants}
                            initial="hidden"
                            animate="visible"
                            style={{ '--status-color': status.color }}
                          >
                            <span className="htu-status-icon">{status.animation}</span>
                            <span className="htu-status-text">{status.meaning}</span>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* Platforms Section */}
                    <div className="htu-section">
                      <h4>
                        <span>🌐</span> Supported Platforms
                      </h4>
                      <div className="htu-platforms-grid">
                        {platforms.map((platform, i) => (
                          <motion.div
                            key={i}
                            className="htu-platform-card"
                            custom={i}
                            variants={stepItemVariants}
                            initial="hidden"
                            animate="visible"
                          >
                            <div className="htu-platform-header">
                              <span className="htu-platform-icon">{platform.icon}</span>
                              <span className="htu-platform-name">{platform.name}</span>
                            </div>
                            <div className="htu-platform-features">
                              {platform.features.map((feature, j) => (
                                <span key={j} className="htu-feature-tag">{feature}</span>
                              ))}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* Key Features */}
                    <div className="htu-section">
                      <h4>
                        <span>⚡</span> Key Features
                      </h4>
                      <div className="htu-features-grid">
                        {[
                          { icon: '🎯', title: 'Smart Extraction', desc: 'Auto-detects problem details' },
                          { icon: '🔄', title: 'Seamless Sync', desc: 'One-click capture & save' },
                          { icon: '🔐', title: 'Secure Auth', desc: 'Auto token management' },
                          { icon: '📴', title: 'Offline Support', desc: 'Queues sync when offline' },
                        ].map((feature, i) => (
                          <motion.div
                            key={i}
                            className="htu-feature-card"
                            custom={i}
                            variants={stepItemVariants}
                            initial="hidden"
                            animate="visible"
                            whileHover={{ scale: 1.02, y: -2 }}
                          >
                            <span className="htu-feature-icon-big">{feature.icon}</span>
                            <span className="htu-feature-title">{feature.title}</span>
                            <span className="htu-feature-desc">{feature.desc}</span>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer Navigation */}
            <div className="htu-modal-footer">
              <button
                className="htu-nav-btn prev"
                onClick={() => setActiveStep((prev) => Math.max(0, prev - 1))}
                disabled={activeStep === 0}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path fillRule="evenodd" d="M7.72 12.53a.75.75 0 010-1.06l7.5-7.5a.75.75 0 111.06 1.06L9.31 12l6.97 6.97a.75.75 0 11-1.06 1.06l-7.5-7.5z" clipRule="evenodd" />
                </svg>
                Previous
              </button>
              <div className="htu-step-dots">
                {[0, 1, 2, 3].map((i) => (
                  <button
                    key={i}
                    className={`htu-dot ${activeStep === i ? 'active' : ''}`}
                    onClick={() => setActiveStep(i)}
                  />
                ))}
              </div>
              <button
                className="htu-nav-btn next"
                onClick={() => setActiveStep((prev) => Math.min(3, prev + 1))}
                disabled={activeStep === 3}
              >
                Next
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path fillRule="evenodd" d="M16.28 11.47a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 011.06-1.06l7.5 7.5z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default HowToUseModal;
