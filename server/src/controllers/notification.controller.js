import * as service from "../services/notification.service.js";

import * as validator from "../validators/notification.validator.js";

export const getNotifications = async (req, res) => {
  const parsed = validator.getNotificationsSchema.safeParse(req.query);

  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      message: parsed.error.errors,
    });
  }

  const result = await service.getNotifications(req.user.id, parsed.data);

  return res.json({
    success: true,
    data: result,
  });
};

export const createNotification = async (req, res) => {
  const parsed = validator.createNotificationSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      message: parsed.error.errors,
    });
  }

  const result = await service.createNotification(req.user, parsed.data);

  return res.status(201).json({
    success: true,
    message: "Notification created successfully",
    data: result,
  });
};

export const markAsRead = async (req, res) => {
  const { id } = req.params;

  const result = await service.markAsRead(id, req.user.id);

  return res.json({
    success: true,
    message: "Notification marked as read",
    data: result,
  });
};

export const markAllAsRead = async (req, res) => {
  await service.markAllAsRead(req.user.id);

  return res.json({
    success: true,
    message: "All notifications marked as read",
  });
};

export const deleteNotification = async (req, res) => {
  const { id } = req.params;

  await service.deleteNotification(id, req.user.id);

  return res.json({
    success: true,
    message: "Notification deleted successfully",
  });
};
