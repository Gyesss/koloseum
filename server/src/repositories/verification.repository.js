import { prisma } from "../config/prisma.js";

export const createToken = (data) => {
  return prisma.verificationToken.create({ data });
};

export const findToken = (userId, type) => {
  return prisma.verificationToken.findUnique({
    where: { userId_type: { userId, type } },
  });
};

export const updateToken = (id, data) => {
  return prisma.verificationToken.update({ where: { id }, data });
};

export const deleteToken = (id) => {
  return prisma.verificationToken.delete({ where: { id } });
};
