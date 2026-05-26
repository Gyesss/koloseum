import api from "./client";

// key => media

export const createMediaPost = async (postId, formData) => {
  const response = await api.post(`/media/posts/${postId}`, formData);

  return response.data;
};

export const createEventBanner = async (eventId, formData) => {
  const response = await api.post(`/media/events/${eventId}/banner`, formData);

  return response.data;
};

export const createUserAvatar = async (formData) => {
  const response = await api.post("/media/user/avatar", formData);

  return response.data;
};

export const createUserBanner = async (formData) => {
  const response = await api.post("/media/user/banner", formData);

  return response.data;
};
