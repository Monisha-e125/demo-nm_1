const auth = (allowedRoles = []) => {
  return (req, res, next) => {
    // Mock user for Module-based development
    req.user = {
      id: 'demo-user-id',
      role: 'HR Admin'
    };

    if (
      allowedRoles.length > 0 &&
      !allowedRoles.includes(req.user.role)
    ) {
      return res.status(403).json({ message: 'Access denied' });
    }

    next();
  };
};

module.exports = { auth };
