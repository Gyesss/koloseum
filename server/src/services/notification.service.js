import * as repo from "../repositories/notification.repository.js";

const ensureNotificationExists = async (id) => {
  const notification = await repo.findNotificationById(id);

  if (!notification) {
    throw new Error("Notification not found");
  }

  return notification;
};

const ensureOwnership = (notification, userId) => {
  if (notification.userId !== userId) {
    throw new Error("Forbidden");
  }
};

export const getNotifications = async (userId, query) => {
  const page = query.page || 1;

  const limit = query.limit || 20;

  const skip = (page - 1) * limit;

  const [notifications, total] = await Promise.all([
    repo.findNotificationsByUser(userId, {
      skip,
      take: limit,
      unread: query.unread,
    }),

    repo.countNotificationsByUser(userId, query.unread),
  ]);

  return {
    items: notifications,

    meta: {
      page,
      limit,
      total,

      totalPages: Math.ceil(total / limit),
    },
  };
};

export const createNotification = async (user, data) => {
  if (user.role !== "ADMIN") {
    throw new Error("Forbidden");
  }

  return repo.createNotification(data);
};

export const markAsRead = async (id, userId) => {
  const notification = await ensureNotificationExists(id);

  ensureOwnership(notification, userId);

  return repo.markAsRead(id);
};

export const markAllAsRead = async (userId) => {
  await repo.markAllAsRead(userId);

  return true;
};

export const deleteNotification = async (id, userId) => {
  const notification = await ensureNotificationExists(id);

  ensureOwnership(notification, userId);

  await repo.deleteNotification(id);

  return true;
};
