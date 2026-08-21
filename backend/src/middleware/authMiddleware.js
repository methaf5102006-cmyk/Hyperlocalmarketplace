const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        message: "No token provided",
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "Invalid token format",
      });
    }

    // ✅ FIX: same secret key use karo jo token banate waqt use ki thi
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "secretKey123"
    );

    req.user = decoded;

    next();

  } catch (err) {
    console.log("AUTH ERROR:", err.message);

    return res.status(401).json({
      message: "Token failed",
    });
  }
};

module.exports = authMiddleware;