import * as service from "../services/comment-like.service.js";

export const likeComment = async (req, res) => {
  const { commentId } = req.params;

  await service.likeComment(commentId, req.user);

  return res.status(201).json({
    success: true,
    message: "Comment liked successfully",
  });
};

export const unlikeComment = async (req, res) => {
  const { commentId } = req.params;

  await service.unlikeComment(commentId, req.user);

  return res.json({
    success: true,
    message: "Comment unliked successfully",
  });
};
