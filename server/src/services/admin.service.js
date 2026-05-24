import * as repo from "../repositories/admin.repository.js";

export const updateUserRole = async (data) => {
  const updated = await repo.updateUserRole(data.userId, data.role);
  return updated;
};
