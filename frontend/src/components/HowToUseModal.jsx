import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './HowToUseModal.css';

const HowToUseModal = ({ isOpen, onClose }) => {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      id: 1,
      title: 'Install Extension',
      icon: '🧩',
      color: '#3b82f6',
      substeps: [
        { icon: '📁', text: 'Clone or Download', detail: 'Get the repository from GitHub', link: 'https://github.com/kishanravi887321/codex.git' },
        { icon: '🌐', text: 'Open Extensions', detail: 'Navigate to chrome://extensions/' },
        { icon: '⚙️', text: 'Developer Mode', detail: 'Enable the toggle in the top-right' },
        { icon: '📦', text: 'Load Unpacked', detail: 'Select the downloaded codex folder' },
        { icon: '📌', text: 'Pin Extension', detail: 'Pin it to your browser toolbar' },
      ],
    },
    {
      id: 2,
      title: 'Connect Account',
      icon: '🔗',
      color: '#10b981',
      substeps: [
        { icon: '🌐', text: 'Visit CPCoders', detail: 'Go to the official platform', link: 'https://cp.saksin.online' },
        { icon: '🔐', text: 'Login', detail: 'Sign in securely with Google' },
        { icon: '🔄', text: 'Refresh Page', detail: 'Authentication syncs automatically' },
        { icon: '✅', text: 'Connected!', detail: 'Look for the green checkmark' },
      ],
    },
    {
      id: 3,
      title: 'Start Capturing',
      icon: '🚀',
      color: '#8b5cf6',
      substeps: [
        { icon: '📝', text: 'Open Problem', detail: 'Visit LeetCode, GFG, or InterviewBit', link: 'https://leetcode.com/problemset/all/' },
        { icon: '👁️', text: 'Click Eye Icon', detail: 'Find the floating button on the page' },
        { icon: '👆', text: 'Capture', detail: 'Problem details sync instantly' },
        { icon: '📊', text: 'Dashboard', detail: 'View your progress online', link: 'https://cp.saksin.online/problems' },
      ],
    },
    {
      id: 4,
      title: 'Features & Info',
      icon: '✨',
      color: '#f59e0b',
      isFeatures: true
    }
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
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { type: 'spring', damping: 25, stiffness: 300 }
    },
    exit: { opacity: 0, scale: 0.95, y: 20 },
  };

  const contentVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, x: -20, transition: { duration: 0.2 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.05 },
    }),
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="htu-backdrop"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          onClick={onClose}
        >
          <motion.div
            className="htu-container"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Sidebar Navigation */}
            <div className="htu-sidebar">
              <div className="htu-brand">
                <div className="htu-brand-icon">📖</div>
                <div className="htu-brand-text">
                  <h2>Quick Start</h2>
                  <p>Setup in 2 minutes</p>
                </div>
              </div>

              <div className="htu-nav-list">
                {steps.map((step, index) => (
                  <button
                    key={step.id}
                    className={`htu-nav-item ${activeStep === index ? 'active' : ''}`}
                    onClick={() => setActiveStep(index)}
                    style={{ '--theme-color': step.color }}
                  >
                    <span className="htu-nav-icon">{step.icon}</span>
                    <span className="htu-nav-title">{step.title}</span>
                    {activeStep === index && (
                      <motion.div 
                        layoutId="activeNavIndicator" 
                        className="htu-nav-indicator" 
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Main Content Area */}
            <div className="htu-main">
              <button className="htu-close-btn" onClick={onClose}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clipRule="evenodd" />
                </svg>
              </button>

              <div className="htu-content-wrapper">
                <AnimatePresence mode="wait">
                  {!steps[activeStep].isFeatures ? (
                    <motion.div
                      key={`step-${activeStep}`}
                      className="htu-step-view"
                      variants={contentVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                    >
                      <div className="htu-step-header" style={{ '--theme-color': steps[activeStep].color }}>
                        <div className="htu-step-icon-large">{steps[activeStep].icon}</div>
                        <div>
                          <span className="htu-step-badge">Step {steps[activeStep].id}</span>
                          <h3>{steps[activeStep].title}</h3>
                        </div>
                      </div>

                      <div className="htu-timeline">
                        {steps[activeStep].substeps.map((substep, i) => {
                          const isLink = !!substep.link;
                          const Wrapper = isLink ? motion.a : motion.div;
                          const props = isLink ? {
                            href: substep.link,
                            target: "_blank",
                            rel: "noopener noreferrer",
                            className: "htu-timeline-item clickable"
                          } : {
                            className: "htu-timeline-item"
                          };

                          return (
                            <Wrapper
                              key={i}
                              {...props}
                              custom={i}
                              variants={itemVariants}
                              initial="hidden"
                              animate="visible"
                            >
                              <div className="htu-timeline-marker" style={{ '--theme-color': steps[activeStep].color }}>
                                {i + 1}
                              </div>
                              <div className="htu-timeline-content">
                                <div className="htu-timeline-icon">{substep.icon}</div>
                                <div className="htu-timeline-text">
                                  <h4>
                                    {substep.text}
                                    {isLink && (
                                      <svg className="htu-link-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M4.25 5.5a.75.75 0 00-.75.75v8.5c0 .414.336.75.75.75h8.5a.75.75 0 00.75-.75v-4a.75.75 0 011.5 0v4A2.25 2.25 0 0112.75 17h-8.5A2.25 2.25 0 012 14.75v-8.5A2.25 2.25 0 014.25 4h5a.75.75 0 010 1.5h-5z" clipRule="evenodd" />
                                        <path fillRule="evenodd" d="M6.194 12.753a.75.75 0 001.06.053L16.5 4.44v2.81a.75.75 0 001.5 0v-4.5a.75.75 0 00-.75-.75h-4.5a.75.75 0 000 1.5h2.553l-9.056 8.194a.75.75 0 00-.053 1.06z" clipRule="evenodd" />
                                      </svg>
                                    )}
                                  </h4>
                                  <p>{substep.detail}</p>
                                </div>
                              </div>
                            </Wrapper>
                          );
                        })}
                      </div>

                      {activeStep === 0 && (
                        <motion.div className="htu-alert info" variants={itemVariants} custom={5} initial="hidden" animate="visible">
                          <span className="htu-alert-icon">💡</span>
                          <p>Pin the extension for quick access from your browser toolbar!</p>
                        </motion.div>
                      )}

                      {activeStep === 1 && (
                        <motion.div className="htu-alert success" variants={itemVariants} custom={4} initial="hidden" animate="visible">
                          <span className="htu-alert-icon">🎉</span>
                          <p>Authentication syncs automatically - no extra steps needed!</p>
                        </motion.div>
                      )}
                    </motion.div>
                  ) : (
                    <motion.div
                      key="features"
                      className="htu-features-view"
                      variants={contentVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                    >
                      <div className="htu-step-header" style={{ '--theme-color': steps[activeStep].color }}>
                        <div className="htu-step-icon-large">{steps[activeStep].icon}</div>
                        <div>
                          <span className="htu-step-badge">Overview</span>
                          <h3>Features & Info</h3>
                        </div>
                      </div>

                      <div className="htu-grid-section">
                        <h4><span className="htu-section-icon">🎨</span> Visual Feedback</h4>
                        <div className="htu-status-grid">
                          {statusIndicators.map((status, i) => (
                            <motion.div key={i} className="htu-status-card" custom={i} variants={itemVariants} initial="hidden" animate="visible" style={{ '--status-color': status.color }}>
                              <div className="htu-status-dot">{status.animation}</div>
                              <span>{status.meaning}</span>
                            </motion.div>
                          ))}
                        </div>
                      </div>

                      <div className="htu-grid-section">
                        <h4><span className="htu-section-icon">🌐</span> Supported Platforms</h4>
                        <div className="htu-platform-grid">
                          {platforms.map((platform, i) => (
                            <motion.div key={i} className="htu-platform-card" custom={i} variants={itemVariants} initial="hidden" animate="visible">
                              <div className="htu-platform-head">
                                <span className="htu-platform-icon">{platform.icon}</span>
                                <h5>{platform.name}</h5>
                              </div>
                              <div className="htu-tags">
                                {platform.features.map((feature, j) => (
                                  <span key={j} className="htu-tag">{feature}</span>
                                ))}
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>

                      <div className="htu-grid-section">
                        <h4><span className="htu-section-icon">⚡</span> Key Features</h4>
                        <div className="htu-feature-grid">
                          {[
                            { icon: '🎯', title: 'Smart Extraction', desc: 'Auto-detects problem details' },
                            { icon: '🔄', title: 'Seamless Sync', desc: 'One-click capture & save' },
                            { icon: '🔐', title: 'Secure Auth', desc: 'Auto token management' },
                            { icon: '📴', title: 'Offline Support', desc: 'Queues sync when offline' },
                          ].map((feature, i) => (
                            <motion.div key={i} className="htu-feature-item" custom={i} variants={itemVariants} initial="hidden" animate="visible">
                              <div className="htu-feature-icon">{feature.icon}</div>
                              <div className="htu-feature-text">
                                <h5>{feature.title}</h5>
                                <p>{feature.desc}</p>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default HowToUseModal;
