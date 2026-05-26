import api from "./client";

export const likeComment = async (eventId, postId, commentId) => {
  const response = await api.post(
    `/events/${eventId}/posts/${postId}/comments/${commentId}/likes`,
  );

  return response.data;
};

export const unlikeComment = async (eventId, postId, commentId) => {
  const response = await api.delete(
    `/events/${eventId}/posts/${postId}/comments/${commentId}/likes`,
  );

  return response.data;
};
