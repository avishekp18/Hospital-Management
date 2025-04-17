const roleMiddleware = (roles) => {
  return (req, res, next) => {
    console.log(`[${new Date().toISOString()}] Checking role - User:`, req.user, 'Required:', roles);
    if (!req.user || !roles.includes(req.user.role)) {
      console.log(`[${new Date().toISOString()}] Forbidden - Role:`, req.user?.role);
      return res.status(403).json({ message: 'Forbidden: Insufficient role' });
    }
    next();
  };
};

export { roleMiddleware };