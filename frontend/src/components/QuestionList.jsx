import { useState, useEffect, useRef } from 'react';
import './QuestionList.css';

const QuestionList = ({ 
  questions, 
  onStatusChange, 
  onBookmarkToggle, 
  onDelete,
  onEdit,
  onTopicClick
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
    const newStatus = currentStatus === 'solved' ? 'unsolved' : 'solved';
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
    
    // SVG Icons for major companies
    const companyLogos = {
      google: (
        <svg viewBox="0 0 24 24" className="company-logo" title={company}>
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
      ),
      amazon: (
        <svg viewBox="0 0 24 24" className="company-logo" title={company}>
          <path fill="#FF9900" d="M.045 18.02c.072-.116.187-.124.348-.022 3.636 2.11 7.594 3.166 11.87 3.166 2.852 0 5.668-.533 8.447-1.595l.315-.14c.138-.06.234-.1.293-.13.226-.088.39-.046.493.13.12.2.052.4-.162.6-.443.4-1.14.9-2.09 1.5-.95.6-2.092 1.14-3.427 1.62-1.335.48-2.767.72-4.296.72-1.88 0-3.695-.27-5.444-.81-1.75-.54-3.3-1.27-4.65-2.19-.305-.21-.44-.48-.41-.81.034-.337.183-.6.45-.79l.263-.24zm6.137-5.63c0-1.027.254-1.92.76-2.678.506-.758 1.196-1.34 2.07-1.746.836-.388 1.81-.65 2.924-.788.39-.046 1.004-.092 1.845-.138v-.544c0-.678-.08-1.152-.242-1.42-.322-.503-.862-.756-1.617-.756-.66 0-1.16.148-1.5.444-.34.296-.54.746-.6 1.35l-.06.39c-.032.195-.153.3-.364.31l-2.13-.04c-.21-.01-.316-.13-.316-.36 0-.8.28-1.52.84-2.16.56-.64 1.31-1.1 2.25-1.38.94-.28 1.95-.42 3.03-.42 1.106 0 2.054.156 2.845.47.79.313 1.37.7 1.74 1.16.367.46.59.88.67 1.26.08.38.12.84.12 1.38v5.2c0 .56.02 1.01.06 1.35.04.34.13.68.27 1.02.14.34.25.57.34.68.088.11.2.24.33.39.14.16.2.3.18.42-.02.11-.12.22-.3.3-.44.22-.88.4-1.32.54l-.22.06c-.218.06-.4.06-.54 0-.14-.06-.3-.17-.48-.33l-.18-.18c-.14-.14-.26-.34-.36-.6-.1-.26-.18-.44-.24-.54-.45.48-1.01.87-1.68 1.17s-1.42.45-2.25.45c-1.026 0-1.88-.29-2.56-.87-.68-.58-1.02-1.41-1.02-2.49zm5.63-.72c-.66 0-1.21.18-1.65.54-.44.36-.66.87-.66 1.53 0 .6.17 1.07.51 1.41.34.34.8.51 1.38.51.72 0 1.34-.22 1.86-.66.52-.44.78-1.1.78-1.98v-.9c-.56-.03-1.14-.03-1.74 0-.6.03-1.04.1-1.32.21l-.16.34z"/>
          <path fill="#FF9900" d="M21.69 21.03c-.45.54-1.32 1.08-2.37 1.5-1.05.42-2.04.63-2.97.63-.9 0-1.68-.14-2.34-.42l-.21-.09c-.18-.09-.27-.21-.27-.36 0-.09.03-.18.09-.27.06-.09.15-.15.27-.18l.36-.06c.9-.18 1.68-.48 2.34-.9.66-.42 1.23-.93 1.71-1.53.48-.6.84-1.23 1.08-1.89.24-.66.36-1.32.36-1.98v-.18c0-.12-.03-.21-.09-.27-.06-.06-.15-.09-.27-.09h-.45c-.24 0-.45.03-.63.09-.18.06-.36.15-.54.27-.18.12-.33.24-.45.36-.12.12-.27.27-.45.45l-.09.09c-.06.06-.15.09-.27.09-.18 0-.3-.06-.36-.18-.06-.12-.06-.27 0-.45l.18-.54c.12-.36.33-.69.63-.99.3-.3.66-.54 1.08-.72.42-.18.87-.27 1.35-.27h.54c.66 0 1.17.21 1.53.63.36.42.54 1.02.54 1.8v.36c0 1.08-.21 2.1-.63 3.06-.42.96-1.02 1.8-1.8 2.52z"/>
        </svg>
      ),
      microsoft: (
        <svg viewBox="0 0 24 24" className="company-logo" title={company}>
          <path fill="#F25022" d="M1 1h10v10H1z"/>
          <path fill="#7FBA00" d="M13 1h10v10H13z"/>
          <path fill="#00A4EF" d="M1 13h10v10H1z"/>
          <path fill="#FFB900" d="M13 13h10v10H13z"/>
        </svg>
      ),
      meta: (
        <svg viewBox="0 0 24 24" className="company-logo" title={company}>
          <path fill="#0668E1" d="M12 2.04c-5.5 0-10 4.49-10 10.02 0 5 3.66 9.15 8.44 9.9v-7H7.9v-2.9h2.54V9.85c0-2.52 1.49-3.9 3.77-3.9 1.1 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.78-1.63 1.57v1.88h2.78l-.45 2.9h-2.33v7a10 10 0 0 0 8.44-9.9c0-5.53-4.5-10.02-10-10.02z"/>
        </svg>
      ),
      facebook: (
        <svg viewBox="0 0 24 24" className="company-logo" title={company}>
          <path fill="#0668E1" d="M12 2.04c-5.5 0-10 4.49-10 10.02 0 5 3.66 9.15 8.44 9.9v-7H7.9v-2.9h2.54V9.85c0-2.52 1.49-3.9 3.77-3.9 1.1 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.78-1.63 1.57v1.88h2.78l-.45 2.9h-2.33v7a10 10 0 0 0 8.44-9.9c0-5.53-4.5-10.02-10-10.02z"/>
        </svg>
      ),
      apple: (
        <svg viewBox="0 0 24 24" className="company-logo apple-logo" title={company}>
          <path fill="currentColor" d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
        </svg>
      ),
      netflix: (
        <svg viewBox="0 0 24 24" className="company-logo" title={company}>
          <path fill="#E50914" d="M5.398 0v.006c3.028 8.556 5.37 15.175 8.348 23.596 2.344.058 4.85.398 4.854.398-2.8-7.924-5.923-16.747-8.487-24zm8.489 0v9.63L18.6 22.951c-.043-7.86-.004-15.913.002-22.95zM5.398 1.05V24c1.873-.225 2.81-.312 4.715-.398v-9.22z"/>
        </svg>
      ),
      uber: (
        <svg viewBox="0 0 24 24" className="company-logo uber-logo" title={company}>
          <path fill="currentColor" d="M0 7.97v4.958c0 1.867 1.302 3.101 3 3.101.826 0 1.562-.316 2.094-.87v.736H6.27V7.97H5.094v4.625c0 1.227-.8 2.009-1.893 2.009-1.168 0-1.93-.795-1.93-2.01V7.97H0zm7.44 0v7.864h1.176v-.736c.531.554 1.268.87 2.093.87 1.7 0 3.002-1.234 3.002-3.1V7.97h-1.176v4.625c0 1.215-.763 2.01-1.93 2.01-1.094 0-1.893-.782-1.893-2.01V7.97H7.44zm9.063 0v10.99h1.176v-3.86c.531.554 1.268.87 2.093.87 1.7 0 3.002-1.233 3.002-3.1V7.97h-1.176v4.625c0 1.215-.763 2.01-1.93 2.01-1.094 0-1.893-.782-1.893-2.01V7.97h-1.272zm-5.607 3.465c0-1.254.964-2.136 2.09-2.136 1.124 0 2.089.882 2.089 2.136 0 1.254-.965 2.137-2.09 2.137-1.125 0-2.089-.883-2.089-2.137z"/>
        </svg>
      ),
      adobe: (
        <svg viewBox="0 0 24 24" className="company-logo" title={company}>
          <path fill="#FF0000" d="M13.966 22.624l-1.69-4.281H8.122l3.892-9.144 5.662 13.425zM8.884 1.376H0v21.248zm6.232 0L24 22.624V1.376z"/>
        </svg>
      ),
      oracle: (
        <svg viewBox="0 0 24 24" className="company-logo" title={company}>
          <path fill="#F80000" d="M7.076 7.076C3.168 7.076 0 10.244 0 14.152c0 3.908 3.168 7.076 7.076 7.076h9.848c3.908 0 7.076-3.168 7.076-7.076 0-3.908-3.168-7.076-7.076-7.076zm9.525 11.636H7.4a4.56 4.56 0 0 1 0-9.12h9.2a4.56 4.56 0 0 1 0 9.12z"/>
        </svg>
      ),
      nvidia: (
        <svg viewBox="0 0 24 24" className="company-logo" title={company}>
          <path fill="#76B900" d="M8.948 8.798v-1.43c.158-.014.316-.024.478-.031v-.94c-.164.007-.324.017-.478.028v-.725l.483-.032v-.718C5.487 5.14 2.95 7.062 2.114 9.73c.818-.426 1.735-.7 2.71-.812 1.104-.126 2.16.017 3.124.424v-.544zM3.18 11.306c0-.098.008-.194.015-.29.037-.413.12-.813.25-1.197-.815.396-1.524.957-2.073 1.642v2.268c.545-.69 1.248-1.255 2.058-1.656-.164-.245-.25-.502-.25-.767zm6.718-4.27v.926c-.264.035-.523.08-.774.139l.018-.936c.252-.06.507-.107.756-.13zm-1.724.36l.022.938c-.245.073-.484.158-.715.254l-.019-.912c.232-.108.47-.201.712-.28zm-1.613.596l.022.934c-.214.109-.421.23-.617.362l-.021-.894c.197-.152.404-.29.616-.402zm-1.41.778l.022.887c-.163.14-.316.291-.46.45l-.032-.84c.146-.181.304-.35.47-.497zm-1.228 1.078l.026.85c-.094.134-.18.276-.256.422l-.043-.79c.079-.169.172-.33.273-.482zm-.986 1.192l.04.793c-.048.147-.086.3-.113.456l-.063-.737c.033-.177.082-.35.136-.512zm-.593 1.339l.058.742c-.014.147-.021.296-.017.448l-.077-.678c.004-.175.019-.346.036-.512zm-.283 1.455l.073.69c.017.158.045.312.082.465l-.088-.614c-.024-.182-.05-.362-.067-.541zm.074 1.51l.091.607c.047.16.104.316.169.468l-.1-.552c-.06-.173-.118-.348-.16-.523zm.438 1.387l.107.518c.077.148.162.293.255.432l-.112-.475c-.09-.156-.177-.316-.25-.475zm.71 1.163l.122.435c.103.132.212.26.328.382l-.12-.4c-.116-.135-.228-.275-.33-.417zm.891.946l.13.37c.12.115.248.225.38.33l-.131-.338c-.132-.116-.26-.237-.379-.362zm.995.759l.137.315c.13.098.268.19.409.277l-.14-.29c-.141-.096-.28-.197-.406-.302zm1.058.582l.143.268c.14.08.284.155.432.224l-.149-.249c-.146-.075-.29-.156-.426-.243zm1.103.423l.148.228c.146.063.296.121.45.174l-.155-.214c-.152-.058-.301-.12-.443-.188zm1.13.282l.152.193c.152.048.308.09.467.128l-.162-.183c-.155-.042-.312-.088-.457-.138zm1.147.162l.158.163c.16.033.324.06.49.083l-.17-.156c-.162-.027-.324-.056-.478-.09zm1.157.055l.165.135c.17.018.343.031.518.039l-.18-.13c-.17-.012-.34-.027-.503-.044zm4.42-8.753v.93c-.184.046-.364.101-.538.164l.016-.915c.174-.069.349-.128.522-.179zm-1.473.514l.02.918c-.164.074-.323.157-.475.248l-.019-.887c.155-.102.314-.195.474-.279zm-1.313.685l.02.89c-.135.095-.262.198-.382.308l-.019-.847c.123-.127.251-.245.38-.351zm-1.035.84l.02.849c-.097.11-.186.227-.268.35l-.02-.8c.086-.141.176-.273.268-.399zm-.774.96l.02.8c-.065.12-.124.246-.175.375l-.019-.75c.054-.148.111-.29.174-.425zm-.54 1.036l.019.753c-.04.126-.072.256-.098.388l-.02-.698c.027-.152.06-.3.1-.443zm-.344 1.076l.02.7c-.02.128-.031.26-.036.392l-.02-.644c.007-.152.021-.302.036-.448zm-.177 1.084l.02.645c.003.13.014.26.032.388l-.02-.589c-.018-.15-.03-.298-.032-.444zm.04 1.067l.02.593c.022.13.052.256.09.38l-.02-.54c-.038-.146-.07-.29-.09-.433zm.235 1.03l.02.546c.04.126.088.248.143.367l-.02-.499c-.054-.139-.103-.277-.143-.414zm.402.977l.02.506c.056.12.12.236.19.348l-.02-.463c-.07-.13-.135-.259-.19-.39zm.546.91l.02.471c.07.113.148.222.232.327l-.02-.432c-.084-.122-.162-.243-.232-.366zm.671.837l.02.44c.082.106.172.207.267.305l-.02-.406c-.095-.115-.185-.229-.267-.339zm.783.76l.02.412c.092.098.192.19.297.28l-.02-.382c-.105-.105-.206-.208-.297-.31z"/>
        </svg>
      ),
      linkedin: (
        <svg viewBox="0 0 24 24" className="company-logo" title={company}>
          <path fill="#0A66C2" d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      ),
      twitter: (
        <svg viewBox="0 0 24 24" className="company-logo twitter-logo" title={company}>
          <path fill="currentColor" d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      ),
      stripe: (
        <svg viewBox="0 0 24 24" className="company-logo" title={company}>
          <path fill="#635BFF" d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.591-7.305z"/>
        </svg>
      ),
      paypal: (
        <svg viewBox="0 0 24 24" className="company-logo" title={company}>
          <path fill="#003087" d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.541c-.013.076-.026.175-.041.254-.93 4.778-4.005 7.201-9.138 7.201h-2.19a.563.563 0 0 0-.556.479l-1.187 7.527h-.506l-.24 1.516a.56.56 0 0 0 .554.647h3.882c.46 0 .85-.334.922-.788.06-.26.76-4.852.816-5.09a.932.932 0 0 1 .923-.788h.58c3.76 0 6.705-1.528 7.565-5.946.36-1.847.174-3.388-.777-4.471z"/>
          <path fill="#009CDE" d="M20.563 6.916a3.35 3.35 0 0 0-.607-.541c-.013.076-.026.175-.041.254-.93 4.778-4.005 7.201-9.138 7.201h-2.19a.563.563 0 0 0-.556.479l-1.187 7.527h-.506l-.24 1.516a.56.56 0 0 0 .554.647h3.882c.46 0 .85-.334.922-.788.06-.26.76-4.852.816-5.09a.932.932 0 0 1 .923-.788h.58c3.76 0 6.705-1.528 7.565-5.946.36-1.847.174-3.388-.777-4.471z"/>
        </svg>
      ),
      spotify: (
        <svg viewBox="0 0 24 24" className="company-logo" title={company}>
          <path fill="#1DB954" d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
        </svg>
      ),
      airbnb: (
        <svg viewBox="0 0 24 24" className="company-logo" title={company}>
          <path fill="#FF5A5F" d="M12.001 18.275c-.238-.357-.476-.696-.682-1.034-1.239-1.89-2.57-3.907-3.327-6.085-.91-2.684-.334-5.166 1.682-6.49 1.24-.816 2.808-.904 4.107-.223 1.477.76 2.266 2.026 2.266 3.614 0 2.035-1.03 4.057-2.117 6.01-.58 1.033-1.239 2.06-1.929 3.208zm9.607 1.539c-.682 1.891-2.384 3.265-4.272 3.52-1.572.2-2.96-.334-4.158-1.375-.182-.159-.357-.35-.587-.564.381-.477.737-.89 1.048-1.335 1.667-2.397 3.106-4.907 3.97-7.71.595-1.921.698-3.842-.042-5.738-.984-2.538-2.9-4.016-5.56-4.429-2.16-.35-4.15.128-5.85 1.518-2.31 1.89-3.18 4.412-2.57 7.263.538 2.538 1.807 4.762 3.236 6.9.56.84 1.16 1.65 1.768 2.521-.223.19-.42.382-.643.54-1.682 1.285-3.553 1.65-5.559.92C.794 20.63-.33 18.595.085 15.8c.222-1.494.817-2.84 1.588-4.097 1.984-3.221 4.462-5.997 7.39-8.38C11.105 1.668 13.401.444 16.016.09c3.393-.46 6.158.81 8.11 3.55 1.175 1.652 1.71 3.526 1.81 5.542.143 2.77-.587 5.318-1.81 7.756-.413.818-.896 1.603-1.35 2.397-.135.221-.258.461-.414.754 1.635 1.16 2.7 2.62 2.997 4.544.262 1.716-.19 3.264-1.238 4.637-.175.222-.38.42-.513.544z"/>
        </svg>
      ),
      atlassian: (
        <svg viewBox="0 0 24 24" className="company-logo" title={company}>
          <path fill="#0052CC" d="M7.12 11.084a.683.683 0 0 0-1.16.126L.075 22.974a.703.703 0 0 0 .63 1.018h8.19a.678.678 0 0 0 .63-.39c1.767-3.65.696-9.203-2.405-12.518zM11.434.386a15.059 15.059 0 0 0-.997 15.221l4.275 8.596a.704.704 0 0 0 .63.39h8.19a.703.703 0 0 0 .63-1.017L12.587.387a.677.677 0 0 0-1.153-.001z"/>
        </svg>
      ),
      salesforce: (
        <svg viewBox="0 0 24 24" className="company-logo" title={company}>
          <path fill="#00A1E0" d="M10.006 5.415a4.195 4.195 0 0 1 3.045-1.306c1.56 0 2.954.9 3.69 2.205.63-.3 1.35-.45 2.1-.45 2.85 0 5.159 2.34 5.159 5.22s-2.31 5.22-5.16 5.22c-.345 0-.69-.03-1.02-.105a3.9 3.9 0 0 1-3.42 2.01c-.63 0-1.23-.15-1.77-.39a4.69 4.69 0 0 1-4.26 2.745 4.65 4.65 0 0 1-4.05-2.37 4.29 4.29 0 0 1-.78.075c-2.4 0-4.35-1.965-4.35-4.38a4.38 4.38 0 0 1 2.76-4.08 4.94 4.94 0 0 1-.33-1.77c0-2.79 2.25-5.04 5.01-5.04 1.5 0 2.85.66 3.78 1.71"/>
        </svg>
      ),
      flipkart: (
        <svg viewBox="0 0 24 24" className="company-logo" title={company}>
          <path fill="#2874F0" d="M3.833 1.333h16.334c1.38 0 2.5 1.12 2.5 2.5v16.334c0 1.38-1.12 2.5-2.5 2.5H3.833c-1.38 0-2.5-1.12-2.5-2.5V3.833c0-1.38 1.12-2.5 2.5-2.5z"/>
          <path fill="#FFFF00" d="M13.23 9.68c.213.444.174.935-.088 1.326a1.505 1.505 0 0 1-1.282.711 1.505 1.505 0 0 1-1.282-.711c-.261-.39-.3-.882-.088-1.326.213-.444.174-.935-.088-1.326a1.505 1.505 0 0 0-1.282-.711V5.5c1.28 0 2.43.74 2.96 1.9.53-1.16 1.68-1.9 2.96-1.9v2.143c-.52 0-.995.267-1.282.711-.261.39-.3.882-.088 1.326zm-1.37 8.82H6.5v-2.143h5.36c.52 0 .995-.267 1.282-.711.261-.39.3-.882.088-1.326-.213-.444-.174-.935.088-1.326.287-.444.762-.711 1.282-.711V18c-1.28 0-2.43-.74-2.96-1.9-.265.58-.69 1.07-1.22 1.4z"/>
        </svg>
      ),
      walmart: (
        <svg viewBox="0 0 24 24" className="company-logo" title={company}>
          <path fill="#0071CE" d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0z"/>
          <path fill="#FFC220" d="M12 4.5l1.5 4.5h4.5l-3.75 2.625L15.75 16.5 12 13.5l-3.75 3-1.5-4.875L3 9h4.5z"/>
        </svg>
      ),
      tcs: (
        <svg viewBox="0 0 24 24" className="company-logo" title={company}>
          <rect fill="#0076CE" width="24" height="24" rx="4"/>
          <text x="12" y="16" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold" fontFamily="Arial">TCS</text>
        </svg>
      ),
      infosys: (
        <svg viewBox="0 0 24 24" className="company-logo" title={company}>
          <rect fill="#007CC3" width="24" height="24" rx="4"/>
          <text x="12" y="16" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold" fontFamily="Arial">INFY</text>
        </svg>
      ),
      deloitte: (
        <svg viewBox="0 0 24 24" className="company-logo" title={company}>
          <path fill="#86BC25" d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
        </svg>
      ),
      accenture: (
        <svg viewBox="0 0 24 24" className="company-logo" title={company}>
          <path fill="#A100FF" d="M12 2L2 22h4l2.5-5h7l2.5 5h4L12 2zm0 7l2.5 5h-5L12 9z"/>
        </svg>
      ),
      ibm: (
        <svg viewBox="0 0 24 24" className="company-logo" title={company}>
          <path fill="#0530AD" d="M0 7.5h7.5v1H0zm0 2h7.5v1H0zm0 2h7.5v1H0zm0 2h7.5v1H0zm0 2h7.5v1H0zM8.5 7.5h3v1h-3zm0 2h3v1h-3zm0 2h3v1h-3zm0 2h3v1h-3zm0 2h3v1h-3zM12.5 7.5h3v1h-3zm0 2h3v1h-3zm0 2h3v1h-3zm0 2h3v1h-3zm0 2h3v1h-3zM16.5 7.5H24v1h-7.5zm0 2H24v1h-7.5zm0 2H24v1h-7.5zm0 2H24v1h-7.5zm0 2H24v1h-7.5z"/>
        </svg>
      ),
      intel: (
        <svg viewBox="0 0 24 24" className="company-logo" title={company}>
          <path fill="#0071C5" d="M20.42 7.345v9.18h-1.664v-9.18h1.665zm1.04 9.18h1.54v-.96c0-1.92-.36-2.7-2.28-2.7h-1.5v1.2h1.2c.84 0 1.04.18 1.04.96v1.5zm-9.18-3.66c-.72 0-1.08.36-1.08.96v2.7h1.56v-2.58c0-.48.18-.72.72-.72h.84v-1.26h-.96c-.36 0-.72.06-1.08.18v-.18h-1.56v3.66c0 .72.48 1.02 1.32 1.02h.36V15.5h-.12c-.48 0-.66-.12-.66-.48v-2.16h.66v-1.02h-.66v-1.5h-1.56v1.5h-.84v1.02h.84v2.16c0 .9.6 1.5 1.56 1.5h1.68v-1.2h-.96c-.42 0-.6-.12-.6-.42v-2.04h1.56v-1.02h-1.08zm5.34 2.34c0-.66-.36-.96-1.02-.96h-1.68v1.02h1.5c.3 0 .48.12.48.42v.3h-.96c-.9 0-1.44.36-1.44 1.14 0 .72.48 1.14 1.32 1.14h2.16v-2.28h-.36v.22zm-.72 1.62h-.84c-.3 0-.48-.12-.48-.36s.18-.36.48-.36h.84v.72zM7.14 10.665c-1.44 0-2.22.84-2.22 2.16v1.68c0 1.32.78 2.16 2.22 2.16s2.22-.84 2.22-2.16v-1.68c0-1.32-.78-2.16-2.22-2.16zm.66 3.84c0 .66-.3.96-.66.96s-.66-.3-.66-.96v-1.68c0-.66.3-.96.66-.96s.66.3.66.96v1.68zM1 7.345v9.18h5.52v-1.2H2.68v-2.7h3.12v-1.2H2.68v-2.88h3.84v-1.2H1z"/>
        </svg>
      ),
      zoom: (
        <svg viewBox="0 0 24 24" className="company-logo" title={company}>
          <path fill="#2D8CFF" d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm4.75 14.219l-2.625-1.969v1.531c0 .344-.281.625-.625.625H7.25c-.344 0-.625-.281-.625-.625v-5.562c0-.344.281-.625.625-.625h6.25c.344 0 .625.281.625.625v1.531l2.625-1.969a.625.625 0 0 1 1 .5v5.438a.625.625 0 0 1-1 .5z"/>
        </svg>
      ),
      dropbox: (
        <svg viewBox="0 0 24 24" className="company-logo" title={company}>
          <path fill="#0061FF" d="M6 2l6 3.75L6 9.5 0 5.75 6 2zm12 0l6 3.75-6 3.75-6-3.75L18 2zM0 13.25L6 9.5l6 3.75-6 3.75-6-3.75zm18-3.75l6 3.75-6 3.75-6-3.75 6-3.75zM6 18.25l6-3.75 6 3.75-6 3.75-6-3.75z"/>
        </svg>
      ),
      slack: (
        <svg viewBox="0 0 24 24" className="company-logo" title={company}>
          <path fill="#E01E5A" d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zm1.271 0a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313z"/>
          <path fill="#36C5F0" d="M8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zm0 1.271a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312z"/>
          <path fill="#2EB67D" d="M18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zm-1.27 0a2.528 2.528 0 0 1-2.522 2.521 2.528 2.528 0 0 1-2.52-2.521V2.522A2.528 2.528 0 0 1 15.165 0a2.528 2.528 0 0 1 2.521 2.522v6.312z"/>
          <path fill="#ECB22E" d="M15.165 18.956a2.528 2.528 0 0 1 2.521 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zm0-1.27a2.527 2.527 0 0 1-2.52-2.522 2.527 2.527 0 0 1 2.52-2.52h6.313A2.528 2.528 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.521h-6.313z"/>
        </svg>
      ),
      coinbase: (
        <svg viewBox="0 0 24 24" className="company-logo" title={company}>
          <path fill="#0052FF" d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 18.6a6.6 6.6 0 1 1 0-13.2 6.6 6.6 0 0 1 0 13.2z"/>
        </svg>
      ),
      robinhood: (
        <svg viewBox="0 0 24 24" className="company-logo" title={company}>
          <path fill="#00C805" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4 11h-3v5h-2v-5H8v-2h3V6h2v5h3v2z"/>
        </svg>
      ),
      bytedance: (
        <svg viewBox="0 0 24 24" className="company-logo bytedance-logo" title={company}>
          <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15H9v-4.5c0-.83-.67-1.5-1.5-1.5S6 11.67 6 12.5V17H4v-4.5c0-1.93 1.57-3.5 3.5-3.5s3.5 1.57 3.5 3.5V17zm6 0h-2v-4.5c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5V17h-2v-4.5c0-1.93 1.57-3.5 3.5-3.5s3.5 1.57 3.5 3.5V17z"/>
        </svg>
      ),
      tiktok: (
        <svg viewBox="0 0 24 24" className="company-logo bytedance-logo" title={company}>
          <path fill="currentColor" d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
        </svg>
      ),
      lyft: (
        <svg viewBox="0 0 24 24" className="company-logo" title={company}>
          <path fill="#FF00BF" d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm4.8 16.8c-.48.6-1.2.96-1.92.96-.48 0-.84-.12-1.2-.36V18c0 .6-.48 1.08-1.08 1.08S11.52 18.6 11.52 18v-7.2c0-.6.48-1.08 1.08-1.08s1.08.48 1.08 1.08v3.84c0 .72.48 1.2 1.08 1.2.6 0 1.08-.48 1.08-1.2V10.8c0-.6.48-1.08 1.08-1.08s1.08.48 1.08 1.08v4.32c0 .72-.12 1.2-.6 1.68z"/>
        </svg>
      ),
      doordash: (
        <svg viewBox="0 0 24 24" className="company-logo" title={company}>
          <path fill="#FF3008" d="M23.071 8.409a6.09 6.09 0 0 0-5.396-3.228H.584A.589.589 0 0 0 .17 6.184L3.894 9.93a1.752 1.752 0 0 0 1.242.516h12.049a1.554 1.554 0 1 1 .031 3.108H8.91a.589.589 0 0 0-.415 1.003l3.725 3.747a1.75 1.75 0 0 0 1.242.516h3.757c4.887 0 8.584-5.225 5.852-10.411z"/>
        </svg>
      ),
    };

    // Check for partial matches
    for (const [key, logo] of Object.entries(companyLogos)) {
      if (companyLower.includes(key) || key.includes(companyLower)) {
        return <span className="company-logo-wrapper" title={company}>{logo}</span>;
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
      codeforces: <span className="platform-icon-text cf">CF</span>,
      gfg: <span className="platform-icon-text gfg">GFG</span>,
      hackerrank: <span className="platform-icon-text hr">HR</span>,
      codechef: <span className="platform-icon-text cc">CC</span>,
      atcoder: <span className="platform-icon-text ac">AC</span>,
      interviewbit: <span className="platform-icon-text ib">IB</span>,
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
      <div className="list-body">
        {questions.map((question, index) => (
          <div 
            key={question._id} 
            className={`list-row ${index % 2 === 0 ? 'even' : 'odd'} ${expandedRow === question._id ? 'expanded' : ''}`}
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
                      {getCompanyIcon(question.companyTags[0])}
                      {question.companyTags.length > 1 && (
                        <button 
                          className="company-more"
                          onClick={(e) => handleCompanyDropdownToggle(e, question._id)}
                          title={`+${question.companyTags.length - 1} more companies`}
                        >
                          +{question.companyTags.length - 1}
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
