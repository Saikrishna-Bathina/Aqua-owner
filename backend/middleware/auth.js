const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  console.log("🔥 Incoming headers:", req.headers);

  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      next();
    } catch (err) {
      return res.status(401).json({ message: "Invalid token" });
    }
  } else {
    console.log("🚫 Authorization header missing or malformed");
    return res.status(401).json({ message: "Authorization token missing" });
  }
};

module.exports = verifyToken;
