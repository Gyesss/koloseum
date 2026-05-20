import { verifyToken } from "../utils/jwt.js";

export const auth = (req, res, next) => {
  try {
    const header = req.headers.authorization;

    if (!header) throw new Error("No token");

    const token = header.split(" ")[1];

    const decoded = verifyToken(token);

    req.user = decoded;

    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }
};
