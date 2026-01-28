import { useState, useEffect, useRef } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { FaMicrosoft, FaTwitter, FaYahoo } from 'react-icons/fa';
import { 
  SiAmazon, SiMeta, SiFacebook, SiApple, SiNetflix, SiUber, SiAdobe, 
  SiOracle, SiNvidia, SiLinkedin, SiX, SiStripe, SiPaypal, SiSpotify, SiAirbnb, 
  SiAtlassian, SiSalesforce, SiFlipkart, SiWalmart, SiInfosys, SiWipro,
  SiAccenture, SiIntel, SiCisco, SiVmware, SiSamsung, SiCognizant,
  SiRobinhood, SiCoinbase, SiSnapchat,
  SiBytedance, SiTiktok, SiLyft, SiDoordash, SiInstacart, SiShopify, SiDropbox,
  SiZoom, SiSlack, SiTwilio, SiDatabricks, SiSnowflake, SiPalantir,
  // New icons
  SiGeeksforgeeks, SiHackerrank, SiCodechef, SiCodeforces, SiGoldmansachs,
  SiVisa, SiMastercard, SiExpedia, SiIntuit, SiEpicgames, SiQualcomm,
  SiSwiggy, SiZomato, SiPhonepe, SiPaytm, SiRazorpay, SiGrab, SiTcs, SiHcl,
  SiMahindra, SiPayoneer, SiChase, SiDeutschebank, SiBarclays, SiHsbc,
  SiBankofamerica, SiHdfcbank, SiIcicibank, SiGithub, SiGitlab, SiBitbucket,
  SiJira, SiConfluence, SiPinterest, SiReddit, SiQuora, SiDell, SiHp, SiSap, SiSony
} from 'react-icons/si';
import './QuestionList.css';

const QuestionList = ({ 
  questions, 
  onStatusChange, 
  onBookmarkToggle, 
  onDelete,
  onEdit,
  onTopicClick,
  onRowClick,
  selectedQuestionId,
  listRef
}) => {
  const [expandedRow, setExpandedRow] = useState(null);
  const [companyDropdown, setCompanyDropdown] = useState(null);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setCompanyDropdown(null);
      }
    };

    if (companyDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [companyDropdown]);

  const handleStatusToggle = async (e, id, currentStatus) => {
    e.stopPropagation();
    // Cycle through: unsolved -> solved -> for-future -> unsolved
    let newStatus;
    if (currentStatus === 'unsolved') {
      newStatus = 'solved';
    } else if (currentStatus === 'solved') {
      newStatus = 'for-future';
    } else {
      newStatus = 'unsolved';
    }
    await onStatusChange(id, newStatus);
  };

  const handleBookmark = async (e, id) => {
    e.stopPropagation();
    await onBookmarkToggle(id);
  };

  const handleDelete = (e, id) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this question?')) {
      onDelete(id);
    }
  };

  const handleEdit = (e, question) => {
    e.stopPropagation();
    onEdit(question);
  };

  const getDifficultyLabel = (diff) => {
    const labels = {
      easy: 'Easy',
      medium: 'Med.',
      hard: 'Hard'
    };
    return labels[diff] || 'Med.';
  };

  const formatDate = (date) => {
    if (!date) return '-';
    const d = new Date(date);
    const now = new Date();
    const diffDays = Math.floor((now - d) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getCompanyIcon = (company) => {
    const companyLower = company.toLowerCase();
    
    const props = { className: "company-logo", title: company };

    // Explicit valid icons from react-icons
    const iconMap = {
      // Big Tech
      google: <FcGoogle {...props} />,
      amazon: <SiAmazon {...props} color="#FF9900" />,
      microsoft: <FaMicrosoft {...props} color="#00A4EF" />,
      meta: <SiMeta {...props} color="#0668E1" />,
      facebook: <SiFacebook {...props} color="#0668E1" />,
      apple: <SiApple {...props} className="company-logo apple-logo" />,
      netflix: <SiNetflix {...props} color="#E50914" />,
      
      // Tech Giants
      uber: <SiUber {...props} className="company-logo uber-logo" />,
      adobe: <SiAdobe {...props} color="#FF0000" />,
      oracle: <SiOracle {...props} color="#F80000" />,
      nvidia: <SiNvidia {...props} color="#76B900" />,
      intel: <SiIntel {...props} color="#0071C5" />,
      cisco: <SiCisco {...props} color="#049FD9" />,
      vmware: <SiVmware {...props} color="#607078" />,
      samsung: <SiSamsung {...props} color="#1428A0" />,
      salesforce: <SiSalesforce {...props} color="#00A1E0" />,
      qualcomm: <SiQualcomm {...props} color="#3253DC" />,
      dell: <SiDell {...props} color="#007DB8" />,
      hp: <SiHp {...props} color="#0096D6" />,
      sap: <SiSap {...props} color="#0FAAFF" />,
      sony: <SiSony {...props} className="company-logo apple-logo" />,
      
      // Social / Media
      linkedin: <SiLinkedin {...props} color="#0A66C2" />,
      twitter: <FaTwitter {...props} className="company-logo twitter-logo" color="#1DA1F2" />,
      x: <SiX {...props} className="company-logo twitter-logo" />,
      yahoo: <FaYahoo {...props} color="#6001D2" />,
      snap: <SiSnapchat {...props} className="company-logo snap-logo" style={{ color: '#FFFC00', stroke: 'black', strokeWidth: '0.5px' }} />, 
      snapchat: <SiSnapchat {...props} className="company-logo snap-logo" style={{ color: '#FFFC00', stroke: 'black', strokeWidth: '0.5px' }} />,
      spotify: <SiSpotify {...props} color="#1DB954" />,
      bytedance: <SiBytedance {...props} className="company-logo bytedance-logo" />,
      tiktok: <SiTiktok {...props} className="company-logo bytedance-logo" />,
      pinterest: <SiPinterest {...props} color="#E60023" />,
      reddit: <SiReddit {...props} color="#FF4500" />,
      quora: <SiQuora {...props} color="#A82400" />,
      
      // Fintech & Banking
      stripe: <SiStripe {...props} color="#635BFF" />,
      paypal: <SiPaypal {...props} color="#003087" />,
      coinbase: <SiCoinbase {...props} color="#0052FF" />,
      robinhood: <SiRobinhood {...props} color="#00C805" />,
      visa: <SiVisa {...props} color="#1A1F71" />,
      mastercard: <SiMastercard {...props} color="#EB001B" />,
      chase: <SiChase {...props} color="#117ACA" />,
      'jpmorgan': <SiChase {...props} color="#117ACA" />,
      'jp morgan': <SiChase {...props} color="#117ACA" />,
      goldman: <SiGoldmansachs {...props} color="#7399C6" />,
      'goldman sachs': <SiGoldmansachs {...props} color="#7399C6" />,
      deutsche: <SiDeutschebank {...props} color="#0018A8" />,
      barclays: <SiBarclays {...props} color="#00AEEF" />,
      hsbc: <SiHsbc {...props} color="#DB0011" />,
      'bank of america': <SiBankofamerica {...props} color="#012169" />,
      hdfc: <SiHdfcbank {...props} color="#004C8F" />,
      icici: <SiIcicibank {...props} color="#F58220" />,
      intuit: <SiIntuit {...props} color="#0077C5" />,
      payoneer: <SiPayoneer {...props} color="#FF4800" />,
      paytm: <SiPaytm {...props} color="#00BAF2" />,
      phonepe: <SiPhonepe {...props} color="#5F259F" />,
      razorpay: <SiRazorpay {...props} color="#0C2451" />,
      
      // Startups / Tech
      airbnb: <SiAirbnb {...props} color="#FF5A5F" />,
      atlassian: <SiAtlassian {...props} color="#0052CC" />,
      dropbox: <SiDropbox {...props} color="#0061FF" />,
      zoom: <SiZoom {...props} color="#2D8CFF" />,
      slack: <SiSlack {...props} color="#4A154B" />,
      shopify: <SiShopify {...props} color="#7AB55C" />,
      twilio: <SiTwilio {...props} color="#F22F46" />,
      databricks: <SiDatabricks {...props} color="#FF3621" />,
      snowflake: <SiSnowflake {...props} color="#29B5E8" />,
      palantir: <SiPalantir {...props} className="company-logo palantir-logo" />,
      expedia: <SiExpedia {...props} color="#00355F" />,
      github: <SiGithub {...props} className="company-logo apple-logo" />,
      gitlab: <SiGitlab {...props} color="#FC6D26" />,
      bitbucket: <SiBitbucket {...props} color="#0052CC" />,
      jira: <SiJira {...props} color="#0052CC" />,
      confluence: <SiConfluence {...props} color="#0052CC" />,
      epic: <SiEpicgames {...props} className="company-logo apple-logo" />,
      
      // Delivery & Ride-sharing
      lyft: <SiLyft {...props} color="#FF00BF" />,
      doordash: <SiDoordash {...props} color="#FF3008" />,
      instacart: <SiInstacart {...props} color="#43B02A" />,
      grab: <SiGrab {...props} color="#00B14F" />,
      swiggy: <SiSwiggy {...props} color="#FC8019" />,
      zomato: <SiZomato {...props} color="#E23744" />,
      
      // Indian Tech & Consulting
      flipkart: <SiFlipkart {...props} color="#2874F0" />,
      walmart: <SiWalmart {...props} color="#0071CE" />,
      infosys: <SiInfosys {...props} color="#007CC3" />,
      wipro: <SiWipro {...props} color="#3C1053" />,
      cognizant: <SiCognizant {...props} color="#0033A1" />,
      tcs: <SiTcs {...props} color="#0070AD" />,
      hcl: <SiHcl {...props} color="#0072BC" />,
      mahindra: <SiMahindra {...props} color="#E31837" />,
      'tech mahindra': <SiMahindra {...props} color="#E31837" />,
      accenture: <SiAccenture {...props} color="#A100FF" />,
      
      // Custom styled icons for companies without official react-icons
      ola: <span className="company-icon-custom ola" title={company}>O</span>,
      pubmatic: <span className="company-icon-custom pubmatic" title={company}>P</span>,
      deshaw: <span className="company-icon-custom deshaw" title={company}>D</span>,
      'de shaw': <span className="company-icon-custom deshaw" title={company}>D</span>,
      directi: <span className="company-icon-custom directi" title={company}>D</span>,
      infoworks: <span className="company-icon-custom infoworks" title={company}>I</span>,
      'media.net': <span className="company-icon-custom medianet" title={company}>M</span>,
      medianet: <span className="company-icon-custom medianet" title={company}>M</span>,
      'tower research': <span className="company-icon-custom tower" title={company}>T</span>,
      tower: <span className="company-icon-custom tower" title={company}>T</span>,
      'dream11': <span className="company-icon-custom dream11" title={company}>D</span>,
      dream: <span className="company-icon-custom dream11" title={company}>D</span>,
      cred: <span className="company-icon-custom cred" title={company}>C</span>,
      meesho: <span className="company-icon-custom meesho" title={company}>M</span>,
      dunzo: <span className="company-icon-custom dunzo" title={company}>D</span>,
      zerodha: <span className="company-icon-custom zerodha" title={company}>Z</span>,
      groww: <span className="company-icon-custom groww" title={company}>G</span>,
      'morgan stanley': <span className="company-icon-custom morgan" title={company}>MS</span>,
      morgan: <span className="company-icon-custom morgan" title={company}>MS</span>,
      bloomberg: <span className="company-icon-custom bloomberg" title={company}>B</span>,
      citadel: <span className="company-icon-custom citadel" title={company}>C</span>,
      'two sigma': <span className="company-icon-custom twosigma" title={company}>2σ</span>,
    };

    // Check for exact match or includes
    // Priorities: exact match first
    if (iconMap[companyLower]) {
      return <span className="company-logo-wrapper" title={company}>{iconMap[companyLower]}</span>;
    }

    // Then partial matches
    for (const [key, icon] of Object.entries(iconMap)) {
      if (companyLower.includes(key) || key.includes(companyLower)) {
        return <span className="company-logo-wrapper" title={company}>{icon}</span>;
      }
    }
    
    // Default icon with first letter for unknown companies
    return (
      <span className="company-icon default" title={company}>
        {company.charAt(0).toUpperCase()}
      </span>
    );
  };

  const handleCompanyDropdownToggle = (e, questionId) => {
    e.stopPropagation();
    setCompanyDropdown(companyDropdown === questionId ? null : questionId);
  };

  const getPlatformIcon = (platform) => {
    const icons = {
      leetcode: (
        <svg viewBox="0 0 24 24" className="platform-icon leetcode">
          <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z" fill="currentColor"/>
        </svg>
      ),
      codeforces: <SiCodeforces className="platform-icon" color="#1F8ACB" title="Codeforces" />,
      gfg: <SiGeeksforgeeks className="platform-icon" color="#2F8D46" title="GeeksforGeeks" />,
      hackerrank: <SiHackerrank className="platform-icon" color="#00EA64" title="HackerRank" />,
      codechef: <SiCodechef className="platform-icon" color="#5B4638" title="CodeChef" />,
      atcoder: <span className="platform-icon-text ac">AC</span>,
      interviewbit: (
        <svg viewBox="0 0 24 24" className="platform-icon interviewbit">
          {/* Row 1 - Top */}
          <polygon points="12,2 14,5 10,5" fill="#40C4AA"/>
          {/* Row 2 */}
          <polygon points="10,5 12,8 8,8" fill="#F5A623"/>
          <polygon points="14,5 16,8 12,8" fill="#40C4AA"/>
          {/* Row 3 */}
          <polygon points="8,8 10,11 6,11" fill="#40C4AA"/>
          <polygon points="12,8 14,11 10,11" fill="#F5A623"/>
          <polygon points="16,8 18,11 14,11" fill="#40C4AA"/>
          {/* Row 4 */}
          <polygon points="6,11 8,14 4,14" fill="#F5A623"/>
          <polygon points="10,11 12,14 8,14" fill="#40C4AA"/>
          <polygon points="14,11 16,14 12,14" fill="#40C4AA"/>
          <polygon points="18,11 20,14 16,14" fill="#F5A623"/>
          {/* Row 5 - Bottom */}
          <polygon points="4,14 6,17 2,17" fill="#40C4AA"/>
          <polygon points="8,14 10,17 6,17" fill="#F5A623"/>
          <polygon points="12,14 14,17 10,17" fill="#40C4AA"/>
          <polygon points="16,14 18,17 14,17" fill="#F5A623"/>
          <polygon points="20,14 22,17 18,17" fill="#40C4AA"/>
        </svg>
      ),
      other: <span className="platform-icon-text other">?</span>
    };
    return icons[platform] || icons.other;
  };

  return (
    <div className="question-list">
      {/* Header */}
      <div className="list-header">
        <div className="col-status">Status</div>
        <div className="col-title">Title</div>
        <div className="col-company">Company</div>
        <div className="col-platform">Platform</div>
        <div className="col-difficulty">Difficulty</div>
        <div className="col-actions">Actions</div>
      </div>

      {/* Question Rows */}
      <div className="list-body" ref={listRef}>
        {questions.map((question, index) => (
          <div 
            key={question._id} 
            className={`list-row ${index % 2 === 0 ? 'even' : 'odd'} ${expandedRow === question._id ? 'expanded' : ''} ${selectedQuestionId === question._id ? 'selected' : ''}`}
            onClick={() => setExpandedRow(expandedRow === question._id ? null : question._id)}
          >
            <div className="row-main">
              {/* Status Column */}
              <div className="col-status">
                <button 
                  className={`status-check ${question.status}`}
                  onClick={(e) => handleStatusToggle(e, question._id, question.status)}
                  title={question.status === 'solved' ? 'Mark as unsolved' : 'Mark as solved'}
                >
                  {question.status === 'solved' ? (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                      <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
                    </svg>
                  ) : question.status === 'for-future' ? (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                      <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 6a.75.75 0 0 0-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 0 0 0-1.5h-3.75V6Z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <circle cx="12" cy="12" r="9" />
                    </svg>
                  )}
                </button>
              </div>

              {/* Title Column */}
              <div className="col-title">
                <a 
                  href={question.questLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="question-link"
                  onClick={(e) => e.stopPropagation()}
                >
                  <span className="question-number">{question.questNumber}.</span>
                  <span className="question-name">{question.questName}</span>
                </a>
              </div>

              {/* Company Column */}
              <div className="col-company">
                {question.companyTags && question.companyTags.length > 0 ? (
                  <div className="company-badges-wrapper" ref={companyDropdown === question._id ? dropdownRef : null}>
                    <div className="company-badges">
                      {question.companyTags.slice(0, 5).map((company, idx) => (
                        <span key={idx}>{getCompanyIcon(company)}</span>
                      ))}
                      {question.companyTags.length > 5 && (
                        <button 
                          className="company-more"
                          onClick={(e) => handleCompanyDropdownToggle(e, question._id)}
                          title={`+${question.companyTags.length - 5} more companies`}
                        >
                          +{question.companyTags.length - 5}
                        </button>
                      )}
                    </div>
                    {companyDropdown === question._id && question.companyTags.length > 1 && (
                      <div className="company-dropdown" onClick={(e) => e.stopPropagation()}>
                        <div className="company-dropdown-header">Companies</div>
                        {question.companyTags.map((company, idx) => (
                          <div key={idx} className="company-dropdown-item">
                            {getCompanyIcon(company)}
                            <span className="company-name">{company}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <span className="company-badge empty">-</span>
                )}
              </div>

              {/* Platform Column - Click to expand and see topics */}
              <div className="col-platform">
                <div className="platform-badge" title="Click row to see topics">
                  {getPlatformIcon(question.platform)}
                </div>
              </div>

              {/* Difficulty Column */}
              <div className="col-difficulty">
                <span className={`difficulty-badge ${question.difficulty}`}>
                  {getDifficultyLabel(question.difficulty)}
                </span>
              </div>

              {/* Actions Column */}
              <div className="col-actions">
                <button 
                  className={`action-btn bookmark ${question.bookmarked ? 'active' : ''}`}
                  onClick={(e) => handleBookmark(e, question._id)}
                  title={question.bookmarked ? 'Remove bookmark' : 'Bookmark'}
                >
                  {question.bookmarked ? (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                      <path fillRule="evenodd" d="M6.32 2.577a49.255 49.255 0 0 1 11.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 0 1-1.085.67L12 18.089l-7.165 3.583A.75.75 0 0 1 3.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93Z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
                    </svg>
                  )}
                </button>
                <button 
                  className="action-btn edit"
                  onClick={(e) => handleEdit(e, question)}
                  title="Edit"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                  </svg>
                </button>
                <button 
                  className="action-btn delete"
                  onClick={(e) => handleDelete(e, question._id)}
                  title="Delete"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Expanded Row Details */}
            {expandedRow === question._id && (
              <div className="row-expanded">
                <div className="expanded-content">
                  <div className="expanded-info">
                    <div className="info-item">
                      <span className="info-label">Platform:</span>
                      <span className="info-value capitalize">{question.platform}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Added:</span>
                      <span className="info-value">{formatDate(question.createdAt)}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Last Revised:</span>
                      <span className="info-value">{formatDate(question.lastRevisedAt)}</span>
                    </div>
                  </div>
                  {question.notes && (
                    <div className="expanded-notes">
                      <span className="notes-label">Notes:</span>
                      <p className="notes-text">{question.notes}</p>
                    </div>
                  )}
                  {question.topics && question.topics.length > 0 && (
                    <div className="expanded-topics">
                      <span className="topics-label">All Topics:</span>
                      <div className="topics-full">
                        {question.topics.map((topic, i) => (
                          <span 
                            key={i} 
                            className="topic-chip"
                            onClick={(e) => {
                              e.stopPropagation();
                              onTopicClick && onTopicClick(topic);
                            }}
                          >
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="expanded-actions">
                    <button 
                      className={`quick-status-btn ${question.status === 'solved' ? 'active' : ''}`}
                      onClick={(e) => { e.stopPropagation(); onStatusChange(question._id, 'solved'); }}
                    >
                      ✓ Solved
                    </button>
                    <button 
                      className={`quick-status-btn ${question.status === 'unsolved' ? 'active' : ''}`}
                      onClick={(e) => { e.stopPropagation(); onStatusChange(question._id, 'unsolved'); }}
                    >
                      ○ Unsolved
                    </button>
                    <button 
                      className={`quick-status-btn ${question.status === 'for-future' ? 'active' : ''}`}
                      onClick={(e) => { e.stopPropagation(); onStatusChange(question._id, 'for-future'); }}
                    >
                      ⏰ For Future
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuestionList;
