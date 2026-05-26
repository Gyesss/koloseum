import api from "./client";

export const getPoll = async (eventId, postId) => {
  const response = await api.get(`/events/${eventId}/posts/${postId}/poll`);

  return response.data;
};

// question, maxChoices, options
export const createPoll = async (eventId, postId, data) => {
  const response = await api.post(
    `/events/${eventId}/posts/${postId}/poll`,
    data,
  );

  return response.data;
};

export const deletePoll = async (eventId, postId) => {
  const response = await api.delete(`/events/${eventId}/posts/${postId}/poll`);

  return response.data;
};
