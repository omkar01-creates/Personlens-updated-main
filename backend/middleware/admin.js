
 // Only allows users with the admin role.
function admin(req, res, next) {
  if (req.user && req.user.role?.toLowerCase() === "admin") {
    return next();
  }

  return res.status(403).json({ message: "Admin access only" });
}

module.exports = admin;