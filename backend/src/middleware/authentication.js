const User = require("../models/User");
const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log("Auth header received:", authHeader);
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    //console.log(error);
    return res.status(401).json({ message: "Authentication Invalid" });
  }
  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { userId: payload.userId, name: payload.name };
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: "Authentication Invalid" });
  }
};

module.exports = auth;
