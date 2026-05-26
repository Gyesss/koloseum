import api from "./client";

export const getPosts = async (eventId) => {
  const response = await api.get(`/events/${eventId}/posts`);

  return response.data;
};

export const getPostById = async (eventId, postId) => {
  const response = await api.get(`/events/${eventId}/posts/${postId}`);

  return response.data;
};

// title, caption, postType, isDraft, isFeatured, startAt, endAt
export const createPost = async (eventId, data) => {
  const response = await api.post(`/events/${eventId}/posts`, data);

  return response.data;
};

// title, caption, postType, isDraft, isFeatured, startAt, endAt
export const updatePost = async (eventId, postId, data) => {
  const response = await api.patch(`/events/${eventId}/posts/${postId}`, data);

  return response.data;
};

export const deletePost = async (eventId, postId) => {
  const response = await api.delete(`/events/${eventId}/posts/${postId}`);

  return response.data;
};
