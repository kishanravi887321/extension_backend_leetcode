import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { updateProfile, uploadProfileImage } from '../api/auth';
import './Profile.css';

const EditProfile = () => {
  const navigate = useNavigate();
  const { user, updateUser, logout } = useAuth();
  const fileInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    username: user?.username || '',
    bio: user?.bio || '',
  });
  const [previewImage, setPreviewImage] = useState(user?.picture || '');
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
    setSuccess('');
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size must be less than 5MB');
        return;
      }
      
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        setError('Only JPEG, PNG and WebP images are allowed');
        return;
      }

      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
      setError('');
    }
  };

  const handleUploadImage = async () => {
    if (!selectedFile) return;

    setUploadingImage(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('image', selectedFile);

      const response = await uploadProfileImage(formData);
      if (response.success) {
        updateUser({ ...user, picture: response.picture });
        setSelectedFile(null);
        setSuccess('Profile image updated successfully!');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Upload image first if selected
      if (selectedFile) {
        await handleUploadImage();
      }

      // Update profile data
      const response = await updateProfile(formData);
      if (response.success) {
        updateUser(response.user);
        setSuccess('Profile updated successfully!');
        setTimeout(() => navigate('/profile'), 1500);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="profile-container">
      <nav className="profile-nav">
        <div className="nav-brand">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="nav-icon">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" />
          </svg>
          <span>CPCoders</span>
        </div>
        <div className="nav-links">
          <Link to="/profile" className="nav-link">Profile</Link>
          <Link to="/dashboard" className="nav-link">Dashboard</Link>
          <button onClick={handleLogout} className="btn-logout">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
            </svg>
            Logout
          </button>
        </div>
      </nav>

      <div className="profile-content">
        <div className="edit-profile-card">
          <h2>Edit Profile</h2>
          <p className="edit-subtitle">Update your personal information</p>

          <form onSubmit={handleSubmit}>
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}

            <div className="image-upload-section">
              <div className="image-preview" onClick={handleImageClick}>
                {previewImage ? (
                  <img src={previewImage} alt="Profile preview" />
                ) : (
                  <div className="avatar-placeholder large">
                    {formData.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                )}
                <div className="image-overlay">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
                  </svg>
                  <span>Change Photo</span>
                </div>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/jpeg,image/jpg,image/png,image/webp"
                style={{ display: 'none' }}
              />
              <p className="image-hint">Click to upload. Max 5MB. JPEG, PNG or WebP.</p>
            </div>

            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="username">Username</label>
              <div className="input-prefix">
                <span>@</span>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="username"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="bio">Bio</label>
              <textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Tell us about yourself..."
                rows={4}
                maxLength={500}
              />
              <span className="char-count">{formData.bio.length}/500</span>
            </div>

            <div className="form-actions">
              <Link to="/profile" className="btn-secondary">Cancel</Link>
              <button type="submit" className="btn-primary" disabled={loading || uploadingImage}>
                {loading || uploadingImage ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
