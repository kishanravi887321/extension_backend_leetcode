import { useNavigate } from 'react-router-dom';
import './Auth.css';

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-card">
        <div className="dashboard-icon">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
        </div>
        <h1>Welcome!</h1>
        <p className="dashboard-subtitle">You have successfully signed in to your account.</p>
        <button className="auth-button" onClick={handleLogout}>
          Sign out
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
