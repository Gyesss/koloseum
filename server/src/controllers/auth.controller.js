import * as service from "../services/auth.service.js";
import { registerSchema, loginSchema } from "../validators/auth.validator.js";

export const register = async (req, res) => {
  const parsed = registerSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      message: parsed.error.errors,
    });
  }

  const user = await service.register(parsed.data);

  res.json({
    success: true,
    data: user,
  });
};

export const login = async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      message: parsed.error.errors,
    });
  }

  const result = await service.login(parsed.data);

  res.json({
    success: true,
    data: result,
  });
};

export const me = async (req, res) => {
  const user = await service.me(req.user.id);

  res.json({
    success: true,
    data: user,
  });
};
