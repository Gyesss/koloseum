import api from "./client";

// eventId, phones, content
export const invite = async (data) => {
  const response = await api.post("/invitation", data);

  return response.data;
};
