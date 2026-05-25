import * as service from "../services/invitation.service.js";

export const sendInvitation = async (req, res) => {
  const result = await service.sendInvitation(req.body, req.user);

  res.json({
    success: true,
    message: "Invitation queued",
    data: result,
  });
};
