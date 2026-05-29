import { verifyToken } from "../utils/jwt.js";

export const auth = (required = true) => {
  return (req, res, next) => {
    try {
      const header = req.headers.authorization;

      if (!header) {
        if (!required) {
          req.user = null;

          return next();
        }

        throw new Error("No token");
      }

      const token = header.split(" ")[1];
      const decoded = verifyToken(token);

      req.user = decoded;

      next();
    } catch (err) {
      if (!required) {
        req.user = null;

        return next();
      }

      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }
  };
};
