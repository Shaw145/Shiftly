const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Verify JWT token for admin-protected routes
exports.verifyAdmin = async (req, res, next) => {
  try {
    // Get token from Authorization header
    let token = req.header('Authorization');
    
    // Check if token exists
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No authentication token, access denied'
      });
    }

    // Remove Bearer from token string if it exists
    if (token.startsWith('Bearer ')) {
      token = token.slice(7);
    }

    // Try to verify with admin secret first
    try {
      const decoded = jwt.verify(token, process.env.ADMIN_JWT_SECRET);
      
      // Find admin by ID
      const admin = await User.findById(decoded.id).select('-password');
      
      if (!admin) {
        return res.status(401).json({
          success: false,
          message: 'Admin not found'
        });
      }

      // Check if user is an admin
      if (admin.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Access denied: Admin privileges required'
        });
      }

      // Attach admin to request object
      req.admin = admin;
      req.user = admin; // Also attach as user for compatibility
      next();
    } catch (adminErr) {
      // Try regular user token as fallback
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Find user by ID
        const user = await User.findById(decoded.id).select('-password');
        
        if (!user) {
          return res.status(401).json({
            success: false,
            message: 'User not found'
          });
        }

        // Check if user is an admin
        if (user.role !== 'admin') {
          return res.status(403).json({
            success: false,
            message: 'Access denied: Admin privileges required'
          });
        }

        // Attach admin user to request object
        req.admin = user;
        req.user = user;
        next();
      } catch (userErr) {
        // Both token verifications failed
        return res.status(401).json({
          success: false,
          message: 'Invalid admin token, authentication failed'
        });
      }
    }
  } catch (error) {
    console.error('Admin token verification error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during authorization'
    });
  }
}; 