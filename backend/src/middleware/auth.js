// Authentication middleware
// "Middleware" is code that runs BETWEEN receiving a request and sending a response
// This middleware checks if the request has a valid Firebase auth token
// If not, it blocks the request with a 401 Unauthorized error

import { adminAuth } from '../config/firebase.js';

export const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'No authorization token provided',
      });
    }

    const token = authHeader.split('Bearer ')[1];

    const decodedToken = await adminAuth.verifyIdToken(token);

    req.user = decodedToken;

    next();

  } catch (error) {
    console.error('Token verification failed:', error.message);
    return res.status(401).json({
      success: false,
      error: 'Invalid or expired token',
    });
  }
};

export const verifyAdmin = async (req, res, next) => {
  try {
    const userRecord = await adminAuth.getUser(req.user.uid);
    const claims     = userRecord.customClaims;

    if (!claims || !claims.admin) {
      return res.status(403).json({
        success: false,
        error: 'Access denied. Admin privileges required.',
      });
    }

    next();

  } catch (error) {
    console.error('Admin verification failed:', error.message);
    return res.status(403).json({
      success: false,
      error: 'Access denied',
    });
  }
};

export const verifyDriver = async (req, res, next) => {
  try {
    const userRecord = await adminAuth.getUser(req.user.uid);
    const claims     = userRecord.customClaims;

    if (!claims || (!claims.driver && !claims.admin)) {
      return res.status(403).json({
        success: false,
        error: 'Access denied. Driver privileges required.',
      });
    }

    next();

  } catch (error) {
    console.error('Driver verification failed:', error.message);
    return res.status(403).json({
      success: false,
      error: 'Access denied',
    });
  }
};
