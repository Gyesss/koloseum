import api from "./client";

export const likePost = async (eventId, postId) => {
  const response = await api.post(`/events/${eventId}/posts/${postId}/likes`);

  return response.data;
};

export const unlikePost = async (eventId, postId) => {
  const response = await api.delete(`/events/${eventId}/posts/${postId}/likes`);

  return response.data;
};
