import { prisma } from "../config/prisma.js";

export const findNotificationsByUser = (userId, { skip, take, unread }) => {
  return prisma.notification.findMany({
    where: {
      userId,

      ...(unread !== undefined && {
        isRead: !unread ? undefined : false,
      }),
    },

    orderBy: {
      createdAt: "desc",
    },

    skip,
    take,
  });
};

export const countNotificationsByUser = (userId, unread) => {
  return prisma.notification.count({
    where: {
      userId,

      ...(unread !== undefined && {
        isRead: !unread ? undefined : false,
      }),
    },
  });
};

export const findNotificationById = (id) => {
  return prisma.notification.findUnique({
    where: {
      id,
    },
  });
};

export const createNotification = (data) => {
  return prisma.notification.create({
    data,
  });
};

export const markAsRead = (id) => {
  return prisma.notification.update({
    where: {
      id,
    },

    data: {
      isRead: true,
    },
  });
};

export const markAllAsRead = (userId) => {
  return prisma.notification.updateMany({
    where: {
      userId,
      isRead: false,
    },

    data: {
      isRead: true,
    },
  });
};

export const deleteNotification = (id) => {
  return prisma.notification.delete({
    where: {
      id,
    },
  });
};
