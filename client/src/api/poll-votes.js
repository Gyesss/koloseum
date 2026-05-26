import api from "./client";

// optionIds
export const vote = async (eventId, postId, data) => {
  const response = await api.post(
    `/events/${event}/posts/${postId}/poll/votes`,
    data,
  );

  return response.data;
};

export const unvote = async (eventId, postId) => {
  const response = await api.delete(
    `/events/${event}/posts/${postId}/poll/votes`,
  );

  return response.data;
};
