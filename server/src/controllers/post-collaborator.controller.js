import * as service from "../services/post-collaborator.service.js";

import * as validator from "../validators/post-collaborator.validator.js";

export const inviteCollaborator = async (req, res) => {
  const parsed = validator.inviteCollaboratorSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      message: parsed.error.errors,
    });
  }

  const { postId } = req.params;

  const result = await service.inviteCollaborator(
    postId,
    req.user,
    parsed.data,
  );

  return res.status(201).json({
    success: true,
    message: "Collaborator invited successfully",
    data: result,
  });
};

export const acceptInvitation = async (req, res) => {
  const { postId } = req.params;

  const result = await service.acceptInvitation(postId, req.user);

  return res.json({
    success: true,
    message: "Invitation accepted successfully",
    data: result,
  });
};

export const removeCollaborator = async (req, res) => {
  const { postId, userId } = req.params;

  await service.removeCollaborator(postId, userId, req.user);

  return res.json({
    success: true,
    message: "Collaborator removed successfully",
  });
};

export const getCollaborators = async (req, res) => {
  const { postId } = req.params;

  const result = await service.getCollaborators(postId);

  return res.json({
    success: true,
    data: result,
  });
};
