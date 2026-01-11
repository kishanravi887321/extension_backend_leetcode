import Auth from "../utils/authTokens.js";

export const authenticateToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: "Access token required" });
    }
    
    const token = authHeader.split(' ')[1];
    
    const decoded = Auth.verifyAccessToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};

export const optionalAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const decoded = Auth.verifyAccessToken(token);
      req.user = decoded;
    }
    next();
  } catch (error) {
    next();
  }
};
