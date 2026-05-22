import * as service from "../services/comment.service.js";

import * as validator from "../validators/comment.validator.js";

export const createComment = async (req, res) => {
  const parsed = validator.createCommentSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      message: parsed.error.errors,
    });
  }

  const { postId } = req.params;

  const result = await service.createComment(postId, req.user, parsed.data);

  return res.status(201).json({
    success: true,
    message: "Comment created successfully",
    data: result,
  });
};

export const getComments = async (req, res) => {
  const { postId } = req.params;

  const result = await service.getComments(postId);

  return res.json({
    success: true,
    data: result,
  });
};

export const updateComment = async (req, res) => {
  const parsed = validator.updateCommentSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      message: parsed.error.errors,
    });
  }

  const { commentId } = req.params;

  const result = await service.updateComment(commentId, req.user, parsed.data);

  return res.json({
    success: true,
    message: "Comment updated successfully",
    data: result,
  });
};

export const deleteComment = async (req, res) => {
  const { commentId } = req.params;

  await service.deleteComment(commentId, req.user);

  return res.json({
    success: true,
    message: "Comment deleted successfully",
  });
};
