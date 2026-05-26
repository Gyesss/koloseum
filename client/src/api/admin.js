import api from "./client";

// userId, role
export const updateRole = async (data) => {
  const response = await api.patch("/admin/role", data);

  return response.data;
};
