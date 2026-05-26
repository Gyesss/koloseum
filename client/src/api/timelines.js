import api from "./client";

export const getTimelines = async (eventId) => {
  const response = await api.get(`/events/${eventId}/timelines`);

  return response.data;
};

// name, additional, type, startAt, endAt
export const createTimeline = async (eventId, data) => {
  const response = await api.post(`/events/${eventId}/timelines`, data);

  return response.data;
};

// name, additional, type, startAt, endAt
export const updateTimeline = async (eventId, data) => {
  const response = await api.patch(`/events/${eventId}/timelines`, data);

  return response.data;
};

export const deleteTimeline = async (eventId) => {
  const response = await api.delete(`/events/${eventId}/timelines`);

  return response.data;
};
