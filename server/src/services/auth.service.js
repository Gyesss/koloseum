import * as repo from "../repositories/auth.repository.js";
import * as verificationRepo from "../repositories/verification.repository.js";
import { hashPassword, comparePassword } from "../utils/password.js";
import { signToken } from "../utils/jwt.js";
import { generateOtp, hashOtp } from "../utils/otp.js";
import { sendOtpEmail } from "../utils/mailer.js";

const OTP_EXPIRES_MINUTES = 10;

const createAndSendOtp = async ({ userId, email, fullName, type }) => {
  const otp = generateOtp();
  const tokenHash = hashOtp(otp);
  const expiresAt = new Date(Date.now() + OTP_EXPIRES_MINUTES * 60 * 1000);

  const existing = await verificationRepo.findToken(userId, type);
  if (existing) {
    await verificationRepo.updateToken(existing.id, {
      tokenHash,
      expiresAt,
      usedAt: null,
    });
  } else {
    await verificationRepo.createToken({ userId, type, tokenHash, expiresAt });
  }

  await sendOtpEmail({ to: email, name: fullName, otp, type });
};

export const register = async (data) => {
  const exists = await repo.findByEmail(data.email);

  if (exists) {
    if (!exists.isVerified) {
      await repo.deleteUser(exists.id);
    } else {
      throw new Error("Email already used");
    }
  }

  const usernameTaken = await repo.findByUsername(data.username);
  if (usernameTaken) {
    if (usernameTaken.isVerified) {
      throw new Error("Username already taken");
    } else {
      await repo.deleteUser(usernameTaken.id);
    }
  }

  const hashed = await hashPassword(data.password);

  const user = await repo.createUser({
    username: data.username,
    email: data.email,
    password: hashed,
    fullName: data.fullName,
  });

  try {
    await createAndSendOtp({
      userId: user.id,
      email: user.email,
      fullName: user.fullName,
      type: "EMAIL_VERIFY",
    });
  } catch (err) {
    await repo.deleteUser(user.id);
    throw new Error("Failed to send verification email. Please try again.");
  }

  return {
    message:
      "Registration successful. Please check your email for the OTP verification code.",
  };
};

export const login = async (data) => {
  const user = await repo.findByEmail(data.email);
  if (!user) throw new Error("Invalid credentials");

  const ok = await comparePassword(data.password, user.password);
  if (!ok) throw new Error("Invalid credentials");

  if (!user.isVerified)
    throw new Error("Email not verified. Please verify your email first.");

  const token = signToken({
    id: user.id,
    email: user.email,
    role: user.role,
  });

  return { user, token };
};

export const me = async (userId) => {
  return repo.findById(userId);
};

export const verifyEmail = async ({ email, otp }) => {
  const user = await repo.findByEmail(email);
  if (!user) throw new Error("User not found");
  if (user.isVerified) throw new Error("Email already verified");

  const record = await verificationRepo.findToken(user.id, "EMAIL_VERIFY");
  if (!record) throw new Error("OTP not found. Please request a new one.");
  if (record.usedAt)
    throw new Error("OTP already used. Please request a new one.");
  if (new Date() > record.expiresAt)
    throw new Error("OTP has expired. Please request a new one.");

  const inputHash = hashOtp(otp);
  if (inputHash !== record.tokenHash) throw new Error("Invalid OTP.");

  await verificationRepo.updateToken(record.id, { usedAt: new Date() });
  await repo.updateUser(user.id, { isVerified: true });

  return { message: "Email verified successfully." };
};

export const resendOtp = async ({ email, type }) => {
  const user = await repo.findByEmail(email);
  if (!user) throw new Error("User not found");

  if (type === "EMAIL_VERIFY" && user.isVerified) {
    throw new Error("Email already verified.");
  }

  const existing = await verificationRepo.findToken(user.id, type);
  if (existing && !existing.usedAt) {
    const cooldown = 60 * 1000;
    const createdApprox = new Date(
      existing.expiresAt.getTime() - OTP_EXPIRES_MINUTES * 60 * 1000,
    );
    const elapsedSinceCreated = Date.now() - createdApprox.getTime();
    if (elapsedSinceCreated < cooldown) {
      throw new Error("Please wait 1 minute before requesting a new OTP.");
    }
  }

  await createAndSendOtp({
    userId: user.id,
    email: user.email,
    fullName: user.fullName,
    type,
  });

  return { message: "OTP sent successfully. Please check your email." };
};

export const forgotPassword = async ({ email }) => {
  const user = await repo.findByEmail(email);
  if (!user)
    return { message: "If your email is registered, you will receive an OTP." };

  await createAndSendOtp({
    userId: user.id,
    email: user.email,
    fullName: user.fullName,
    type: "RESET_PASSWORD",
  });

  return { message: "If your email is registered, you will receive an OTP." };
};

export const resetPassword = async ({ email, otp, newPassword }) => {
  const user = await repo.findByEmail(email);
  if (!user) throw new Error("User not found");

  const record = await verificationRepo.findToken(user.id, "RESET_PASSWORD");
  if (!record) throw new Error("OTP not found. Please request a new one.");
  if (record.usedAt)
    throw new Error("OTP already used. Please request a new one.");
  if (new Date() > record.expiresAt)
    throw new Error("OTP has expired. Please request a new one.");

  const inputHash = hashOtp(otp);
  if (inputHash !== record.tokenHash) throw new Error("Invalid OTP.");

  const hashed = await hashPassword(newPassword);
  await verificationRepo.updateToken(record.id, { usedAt: new Date() });
  await repo.updateUser(user.id, { password: hashed });

  return { message: "Password reset successfully." };
};

export const changePassword = async (
  userId,
  { currentPassword, newPassword },
) => {
  const user = await repo.findById(userId);
  if (!user) throw new Error("User not found");

  const ok = await comparePassword(currentPassword, user.password);
  if (!ok) throw new Error("Current password is incorrect");

  if (currentPassword === newPassword)
    throw new Error("New password must be different from current password");

  const hashed = await hashPassword(newPassword);
  await repo.updateUser(userId, { password: hashed });

  return { message: "Password changed successfully." };
};

export const changeEmail = async (userId, { newEmail, password }) => {
  const user = await repo.findById(userId);
  if (!user) throw new Error("User not found");

  const ok = await comparePassword(password, user.password);
  if (!ok) throw new Error("Incorrect password");

  if (newEmail === user.email)
    throw new Error("New email must be different from current email");

  const taken = await repo.findByEmail(newEmail);
  if (taken) throw new Error("Email already used by another account");

  await repo.updateUser(userId, { email: newEmail, isVerified: false });

  await createAndSendOtp({
    userId,
    email: newEmail,
    fullName: user.fullName,
    type: "EMAIL_VERIFY",
  });

  return {
    message:
      "Email updated. Please verify your new email address with the OTP we just sent.",
    newEmail,
  };
};

export const deleteAccount = async (userId, { password, adminPassword }) => {
  const user = await repo.findById(userId);
  if (!user) throw new Error("User not found");

  const ok = await comparePassword(password, user.password);
  if (!ok) throw new Error("Incorrect password");

  if (["ADMIN", "ORGANIZER"].includes(user.role)) {
    const envAdminPassword = process.env.ACCOUNT_DELETE_ADMIN_PASSWORD;
    if (!envAdminPassword)
      throw new Error("Admin deletion password is not configured");
    if (adminPassword !== envAdminPassword)
      throw new Error("Invalid admin deletion password");
  }

  await repo.deleteUser(userId);
};
