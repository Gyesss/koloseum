import { prisma } from "../config/prisma.js";

export const updateById = (id, data) => {
  return prisma.user.update({
    where: {
      id,
    },
    data,
    select: {
      id: true,
      username: true,
      email: true,
      fullName: true,
      role: true,
      bio: true,
      phone: true,
      address: true,
      gender: true,
      birthDay: true,
      // avatar: true,
      // banner: true,
    },
  });
};

export const findByUsername = (username) => {
  return prisma.user.findUnique({
    where: { username },
    select: {
      id: true,
      username: true,
      fullName: true,
      role: true,
      bio: true,
      gender: true,
      birthDay: true,
      // avatar: true,
      // banner: true,
    },
  });
};
