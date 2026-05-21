import * as repo from "../repositories/profile.repository.js";

export const updateProfile = async (userId, data) => {
  const user = await repo.updateById(userId, data);

  return user;
};

export const getProfile = async (username) => {
  const user = await repo.findByUsername(username);

  return user;
};
