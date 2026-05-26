import api from "./client";

// page, limit, unread
export const getNotifications = async (params) => {
  const response = await api.get("/notifications", {
    params,
  });

  return response.data;
};

// userId, title, content, type
export const createNotification = async (data) => {
  const response = await api.post("/notifications", data);

  return response.data;
};

export const readAllNotifications = async () => {
  const response = await api.patch("/notifications/read-all");

  return response.data;
};

export const readNotificationById = async (notificationId) => {
  const response = await api.patch(`/notifications/${notificationId}/read`);

  return response.data;
};

export const deleteNotification = async (notificationId) => {
  const response = await api.delete(`/notifications/${notificationId}`);

  return response.data;
};
