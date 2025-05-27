import jwt from "jsonwebtoken";

function adminMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ errors: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, "adm1nS3cr3tT0kenKey!");
    
    if (!decoded.isAdmin) {
      return res.status(403).json({ errors: "Access denied. Admins only." });
    }

    req.adminId = decoded.id;
    next();
  } catch (error) {
    return res.status(401).json({ errors: "Invalid token or expired" });
  }
}

export default adminMiddleware;
