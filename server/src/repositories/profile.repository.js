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
      avatarUrl: true,
      avatarPath: true,
      bannerUrl: true,
      bannerPath: true,
    },
  });
};

export const findById = (id) => {
  return prisma.user.findUnique({
    where: {
      id,
    },

    select: {
      id: true,
      username: true,
      fullName: true,
      role: true,
      bio: true,
      gender: true,
      birthDay: true,
      avatarUrl: true,
      avatarPath: true,
      bannerUrl: true,
      bannerPath: true,
    },
  });
};
