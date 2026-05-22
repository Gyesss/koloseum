import * as service from "../services/profile.service.js";
import * as validator from "../validators/profile.validator.js";

export const updateProfile = async (req, res) => {
  const parsed = validator.updateProfileScheme.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      message: parsed.error.errors,
    });
  }

  const userId = req.user.id;

  const result = await service.updateProfile(userId, parsed.data);

  return res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    data: result,
  });
};

export const getProfile = async (req, res) => {
  const id = req.params.id;

  const user = await service.getProfile(id);

  res.json({
    success: true,
    data: user,
  });
};
