import api from "./client";

// username, email, password, fullName
export const register = async (data) => {
  const response = await api.post("/auth/register", data);

  return response.data;
};

// email, password
export const login = async (data) => {
  const response = await api.post("/auth/login", data);

  return response.data;
};

export const getMe = async () => {
  const response = await api.get("/auth/me");

  return response.data;
};
