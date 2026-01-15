import { createContext, useContext, useState, useEffect } from 'react';
import api, { logoutUser } from '../api/auth';
import encryptedStorage, { STORAGE_KEYS } from '../utils/encryptedStorage';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      // First try to load cached user data from encrypted storage
      const cachedUser = await encryptedStorage.getItem(STORAGE_KEYS.USER_DATA);
      if (cachedUser) {
        setUser(cachedUser);
        setIsAuthenticated(true);
      }

      // Verify with server (cookies are sent automatically)
      const response = await api.get('/profile/me');

      if (response.data.success) {
        setUser(response.data.user);
        setIsAuthenticated(true);
        // Update encrypted storage with fresh data
        await encryptedStorage.setItem(STORAGE_KEYS.USER_DATA, response.data.user);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      // Clear encrypted storage on auth failure
      await encryptedStorage.removeItem(STORAGE_KEYS.USER_DATA);
      // Keep extensionToken in localStorage for browser extension
      // localStorage.removeItem('extensionToken'); // Uncomment if you want to clear extension token too
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const login = async (userData, extensionToken) => {
    // Store user data in encrypted IndexedDB
    await encryptedStorage.setItem(STORAGE_KEYS.USER_DATA, userData);
    
    // Store extension token in localStorage (for browser extension access)
    if (extensionToken) {
      localStorage.setItem('extensionToken', extensionToken);
    }
    
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = async () => {
    try {
      // Call server to clear cookies
      await logoutUser();
    } catch (error) {
      console.error('Logout API error:', error);
    }
    
    // Clear encrypted storage
    await encryptedStorage.removeItem(STORAGE_KEYS.USER_DATA);
    
    // Clear extension token from localStorage
    localStorage.removeItem('extensionToken');
    
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateUser = async (userData) => {
    setUser(userData);
    // Update encrypted storage
    await encryptedStorage.setItem(STORAGE_KEYS.USER_DATA, userData);
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
    updateUser,
    checkAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
