const { verifyToken } = require('../config/jwt');
const User = require('../models/User');

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Authentication token is required. Please log in.'
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    const user = User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User session is invalid or user no longer exists.'
      });
    }

    req.user = User.sanitize(user);
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired authentication token. Please log in again.'
    });
  }
};

module.exports = authMiddleware;
