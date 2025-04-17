// server/middleware/authMiddleware.js
import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  console.log(`[${new Date().toISOString()}] Token:`, token || 'No token provided');
  if (!token) {
    console.log(`[${new Date().toISOString()}] No token - Returning 401`);
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(`[${new Date().toISOString()}] Decoded:`, decoded);
    req.user = decoded;
    next();
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Token Error:`, error.message);
    res.status(401).json({ message: 'Invalid token' });
  }
};

export { authMiddleware };