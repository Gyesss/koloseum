import api from "./client";

export const getCollaborators = async (eventId, postId) => {
  const response = await api.get(
    `/events/${eventId}/posts/${postId}/collaborators`,
  );

  return response.data;
};

// userId
export const addCollaborator = async (eventId, postId, data) => {
  const response = await api.post(
    `/events/${eventId}/posts/${postId}/collaborators`,
    data,
  );

  return response.data;
};

export const acceptCollaborator = async (eventId, postId) => {
  const response = await api.patch(
    `/events/${eventId}/posts/${postId}/collaborators/accept`,
  );

  return response.data;
};

export const removeCollaborator = async (eventId, postId, userId) => {
  const response = await api.delete(
    `/events/${eventId}/posts/${postId}/collaborators/${userId}`,
  );

  return response.data;
};
