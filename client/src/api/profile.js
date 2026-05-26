import api from "./client";

export const getProfileById = async (userId) => {
  const response = await api.get(`/profile/${userId}`);

  return response.data;
};

// username, email, fullName, bio, phone, address, gender, birthDay
export const updateProfile = async (data) => {
  const response = await api.patch("/profile/me", data);

  return response.data;
};
