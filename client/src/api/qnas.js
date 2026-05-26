import api from "./client";

export const getQnas = async (eventId) => {
  const response = await api.get(`/events/${eventId}/qnas`);

  return response.data;
};

// question, answer
export const createQna = async (eventId, data) => {
  const response = await api.post(`/events/${eventId}/qnas`, data);

  return response.data;
};

// question, answer
export const updateQna = async (eventId, data) => {
  const response = await api.patch(`/events/${eventId}/qnas`, data);

  return response.data;
};

export const deleteQna = async (eventId) => {
  const response = await api.delete(`/events/${eventId}/qnas`);

  return response.data;
};
