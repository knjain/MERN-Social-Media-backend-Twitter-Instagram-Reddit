const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  const token = req.headers["authorization"];
  //console.log(token);
  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "No token provided." });
  }
  jwt.verify(token, "secret", (err, decoded) => {
    if (err) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid token." });
    }

    req.user = decoded;

    next();
  });
};

module.exports = {
  authenticateToken,
};
