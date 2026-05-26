import api from "./client";

export const getComments = async (eventId, postId) => {
  const response = await api.get(`/events/${eventId}/posts/${postId}/comments`);

  return response.data;
};

// content
export const createComment = async (eventId, postId, data) => {
  const response = await api.post(
    `/events/${eventId}/posts/${postId}/comments`,
    data,
  );

  return response.data;
};

// content
export const updateComment = async (eventId, postId, commentId, data) => {
  const response = await api.patch(
    `/events/${eventId}/posts/${postId}/comments/${commentId}`,
    data,
  );

  return response.data;
};

export const deleteComment = async (eventId, postId, commentId) => {
  const response = await api.delete(
    `/events/${eventId}/posts/${postId}/comments/${commentId}`,
  );

  return response.data;
};
