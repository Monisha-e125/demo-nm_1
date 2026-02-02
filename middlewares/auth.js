const auth = (allowedRoles = []) => {
  return (req, res, next) => {
    // Mock user for module-based development
    // Replace later with JWT decoded user
    req.user = {
      id: "demo-user-id",
      role: "HR Admin", // simulate backend role
    };

    // Normalize role (IMPORTANT)
    const normalizedUserRole = req.user.role
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "_");

    const normalizedAllowedRoles = allowedRoles.map(role =>
      role.toLowerCase().trim().replace(/\s+/g, "_")
    );

    if (
      normalizedAllowedRoles.length > 0 &&
      !normalizedAllowedRoles.includes(normalizedUserRole)
    ) {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    // Attach normalized role for downstream use
    req.user.role = normalizedUserRole;

    next();
  };
};

module.exports = { auth };
