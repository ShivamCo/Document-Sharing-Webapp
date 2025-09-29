export const authenticate = (req, res, next) => {
  console.log("Cookies received:", req.cookies); 
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_TOKEN_SECRET, { clockTolerance: 30 });
    req.user = decoded; 
    next(); 
  } catch (error) {
    console.error("JWT verification failed:", error);
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};
