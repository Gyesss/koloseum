import * as service from "../services/auth.service.js";
import * as validator from "../validators/auth.validator.js";

export const register = async (req, res) => {
  const parsed = validator.registerSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      message: parsed.error.errors,
    });
  }

  const result = await service.register(parsed.data);

  res.status(201).json({
    success: true,
    data: result,
  });
};

export const login = async (req, res) => {
  const parsed = validator.loginSchema.safeParse(req.body);

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

export const verifyEmail = async (req, res) => {
  const parsed = validator.verifyEmailSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      message: parsed.error.errors,
    });
  }

  const result = await service.verifyEmail(parsed.data);

  res.json({
    success: true,
    data: result,
  });
};

export const resendVerifyOtp = async (req, res) => {
  const parsed = validator.resendOtpSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      message: parsed.error.errors,
    });
  }

  const result = await service.resendOtp({
    email: parsed.data.email,
    type: "EMAIL_VERIFY",
  });

  res.json({
    success: true,
    data: result,
  });
};

export const resendResetOtp = async (req, res) => {
  const parsed = validator.resendOtpSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      message: parsed.error.errors,
    });
  }

  const result = await service.resendOtp({
    email: parsed.data.email,
    type: "RESET_PASSWORD",
  });

  res.json({
    success: true,
    data: result,
  });
};

export const forgotPassword = async (req, res) => {
  const parsed = validator.forgotPasswordSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      message: parsed.error.errors,
    });
  }

  const result = await service.forgotPassword(parsed.data);

  res.json({
    success: true,
    data: result,
  });
};

export const resetPassword = async (req, res) => {
  const parsed = validator.resetPasswordSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      message: parsed.error.errors,
    });
  }

  const result = await service.resetPassword(parsed.data);

  res.json({
    success: true,
    data: result,
  });
};

export const changePassword = async (req, res) => {
  const parsed = validator.changePasswordSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      message: parsed.error.errors,
    });
  }

  const result = await service.changePassword(req.user.id, parsed.data);

  res.json({
    success: true,
    data: result,
  });
};

export const changeEmail = async (req, res) => {
  const parsed = validator.changeEmailSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      message: parsed.error.errors,
    });
  }

  const result = await service.changeEmail(req.user.id, parsed.data);

  res.json({
    success: true,
    data: result,
  });
};

export const deleteAccount = async (req, res) => {
  const parsed = validator.deleteAccountSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      message: parsed.error.errors,
    });
  }

  await service.deleteAccount(req.user.id, {
    password: parsed.data.password,
    adminPassword: parsed.data.adminPassword,
  });

  res.json({
    success: true,
    data: { message: "Account deleted successfully." },
  });
};
