const adminLogin = async (req, res) => {
  const { email, password } = req.body;

  const ADMIN_EMAIL = "admin@gmail.com";
  const ADMIN_PASSWORD = "123456";

  if (!email || !password) {
    return res.status(400).json({
      message: "Email and password required",
    });
  }

  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    return res.json({
      token: "admin-token-123",
      user: {
        role: "admin",
        email: email,
      },
    });
  }

  return res.status(401).json({
    message: "Invalid admin credentials",
  });
};

module.exports = { adminLogin };