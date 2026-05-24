import { prisma } from "../config/prisma.js";

export const updateUserRole = (userId, role) => {
  return prisma.user.update({
    where: { id: userId },
    data: { role },
    select: {
      id: true,
      username: true,
      email: true,
      role: true,
    },
  });
};
