import { prisma } from "../config/prisma.js";

export const createUser = (data) => {
  return prisma.user.create({ data });
};

export const findByEmail = (email) => {
  return prisma.user.findUnique({ where: { email } });
};

export const findById = (id) => {
  return prisma.user.findUnique({ where: { id } });
};

export const updateUser = (id, data) => {
  return prisma.user.update({ where: { id }, data });
};

export const deleteUser = (id) => {
  return prisma.user.delete({ where: { id } });
};
