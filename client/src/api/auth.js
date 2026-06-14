import api from "./client";

export const register = async (data) => {
  const response = await api.post("/auth/register", data);
  return response.data;
};

export const login = async (data) => {
  const response = await api.post("/auth/login", data);
  return response.data;
};

export const getMe = async () => {
  const response = await api.get("/auth/me");
  return response.data;
};

export const verifyEmail = async (data) => {
  const response = await api.post("/auth/verify-email", data);
  return response.data;
};

export const resendOtp = async (data) => {
  const endpoint =
    data.type === "RESET_PASSWORD"
      ? "/auth/resend-reset-otp"
      : "/auth/resend-otp";
  const response = await api.post(endpoint, { email: data.email });
  return response.data;
};

export const forgotPassword = async (data) => {
  const response = await api.post("/auth/forgot-password", data);
  return response.data;
};

export const resetPassword = async (data) => {
  const response = await api.post("/auth/reset-password", data);
  return response.data;
};

export const changePassword = async (data) => {
  const response = await api.patch("/auth/change-password", data);
  return response.data;
};

export const changeEmail = async (data) => {
  const response = await api.patch("/auth/change-email", data);
  return response.data;
};

export const deleteAccount = async (data) => {
  const response = await api.delete("/auth/account", { data });
  return response.data;
};
