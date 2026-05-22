import * as service from "../services/admin.service.js";
import * as validator from "../validators/admin.validator.js";

export const updateUserRole = async (req, res) => {
  const parsed = validator.updateRoleSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      message: parsed.error.errors,
    });
  }

  const result = await service.updateUserRole(parsed.data);

  return res.json({
    success: true,
    message: "User role updated successfully",
    data: result,
  });
};
