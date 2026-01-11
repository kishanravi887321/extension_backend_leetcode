import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { updateProfile, uploadProfileImage, uploadCoverImage } from '../api/auth';
import './EditProfile.css';

const EditProfile = () => {
  const navigate = useNavigate();
  const { user, updateUser, logout } = useAuth();
  const profileInputRef = useRef(null);
  const coverInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    username: user?.username || '',
    bio: user?.bio || '',
  });
  const [previewImage, setPreviewImage] = useState(user?.picture || '');
  const [previewCover, setPreviewCover] = useState(user?.coverImage || '');
  const [selectedProfileFile, setSelectedProfileFile] = useState(null);
  const [selectedCoverFile, setSelectedCoverFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
    setSuccess('');
  };

  const handleProfileImageClick = () => {
    profileInputRef.current?.click();
  };

  const handleCoverImageClick = () => {
    coverInputRef.current?.click();
  };

  const validateImage = (file) => {
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB');
      return false;
    }
    
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setError('Only JPEG, PNG and WebP images are allowed');
      return false;
    }
    return true;
  };

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file && validateImage(file)) {
      setSelectedProfileFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result);
      reader.readAsDataURL(file);
      setError('');
    }
  };

  const handleCoverImageChange = (e) => {
    const file = e.target.files[0];
    if (file && validateImage(file)) {
      setSelectedCoverFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreviewCover(reader.result);
      reader.readAsDataURL(file);
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Upload profile image if selected
      if (selectedProfileFile) {
        const formData = new FormData();
        formData.append('image', selectedProfileFile);
        const response = await uploadProfileImage(formData);
        if (response.success) {
          updateUser({ ...user, picture: response.picture });
        }
      }

      // Upload cover image if selected
      if (selectedCoverFile) {
        const formData = new FormData();
        formData.append('image', selectedCoverFile);
        const response = await uploadCoverImage(formData);
        if (response.success) {
          updateUser({ ...user, coverImage: response.coverImage });
        }
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
    <div className="edit-profile-page">
      {/* Header */}
      <header className="edit-header">
        <Link to="/profile" className="back-btn">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
          Back to Profile
        </Link>
        <button onClick={handleLogout} className="logout-btn-small">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
          </svg>
        </button>
      </header>

      <div className="edit-container">
        <div className="edit-card">
          <h1>Edit Profile</h1>
          <p className="edit-subtitle">Update your profile information</p>

          <form onSubmit={handleSubmit}>
            {error && <div className="alert alert-error">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}

            {/* Cover Image Section */}
            <div className="cover-section">
              <label className="section-label">Cover Image</label>
              <div className="cover-preview" onClick={handleCoverImageClick}>
                {previewCover ? (
                  <img src={previewCover} alt="Cover preview" />
                ) : (
                  <div className="cover-placeholder">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                    </svg>
                    <span>Click to add cover image</span>
                  </div>
                )}
                <div className="cover-overlay">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
                  </svg>
                  <span>Change Cover</span>
                </div>
              </div>
              <input
                type="file"
                ref={coverInputRef}
                onChange={handleCoverImageChange}
                accept="image/jpeg,image/jpg,image/png,image/webp"
                style={{ display: 'none' }}
              />
            </div>

            {/* Profile Image Section */}
            <div className="profile-image-section">
              <label className="section-label">Profile Photo</label>
              <div className="profile-image-wrapper">
                <div className="profile-image-preview" onClick={handleProfileImageClick}>
                  {previewImage ? (
                    <img src={previewImage} alt="Profile preview" />
                  ) : (
                    <div className="profile-placeholder">
                      {formData.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                  )}
                  <div className="profile-image-overlay">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
                    </svg>
                  </div>
                </div>
                <p className="image-hint">Click to change photo. Max 5MB.</p>
              </div>
              <input
                type="file"
                ref={profileInputRef}
                onChange={handleProfileImageChange}
                accept="image/jpeg,image/jpg,image/png,image/webp"
                style={{ display: 'none' }}
              />
            </div>

            {/* Form Fields */}
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
              <div className="input-with-prefix">
                <span className="input-prefix">@</span>
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

            {/* Actions */}
            <div className="form-actions">
              <Link to="/profile" className="btn-cancel">Cancel</Link>
              <button type="submit" className="btn-save" disabled={loading}>
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
