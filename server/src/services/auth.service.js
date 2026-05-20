import * as repo from "../repositories/auth.repository.js";
import { hashPassword, comparePassword } from "../utils/password.js";
import { signToken } from "../utils/jwt.js";

export const register = async (data) => {
  const exists = await repo.findByEmail(data.email);
  if (exists) throw new Error("Email already used");

  const hashed = await hashPassword(data.password);

  const user = await repo.createUser({
    username: data.username,
    email: data.email,
    password: hashed,
    fullName: data.fullName,
  });

  return user;
};

export const login = async (data) => {
  const user = await repo.findByEmail(data.email);
  if (!user) throw new Error("Invalid credentials");

  const ok = await comparePassword(data.password, user.password);
  if (!ok) throw new Error("Invalid credentials");

  const token = signToken({
    id: user.id,
    email: user.email,
    role: user.role,
  });

  return {
    user,
    token,
  };
};

export const me = async (userId) => {
  return repo.findById(userId);
};
