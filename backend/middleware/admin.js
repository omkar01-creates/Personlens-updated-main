// Only allows users with the ADMIN role.
function admin(req, res, next) {
  if (req.user && req.user.role === "ADMIN") {
    return next();
  }
  return res.status(403).json({ message: "Admin access only" });
}

module.exports = admin;
