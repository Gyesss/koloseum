import api from "./client";

export const getEvents = async () => {
  const response = await api.get("/events");

  return response.data;
};

export const getEventById = async (eventId) => {
  const response = await api.get(`/events/${eventId}`);

  return response.data;
};

// name, tagline, description, location, startAt, endAt, mood
export const createEvent = async (data) => {
  const response = await api.post("/events", data);

  return response.data;
};

// name, tagline, description, location, startAt, endAt, mood
export const updateEvent = async (eventId, data) => {
  const response = await api.patch(`/events/${eventId}`, data);

  return response.data;
};

export const deleteEvent = async (eventId) => {
  const response = await api.delete(`/events/${eventId}`);

  return response.data;
};
