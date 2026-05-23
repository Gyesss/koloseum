import * as service from "../services/post-like.service.js";

export const likePost = async (req, res) => {
  const { postId } = req.params;

  await service.likePost(postId, req.user);

  return res.status(201).json({
    success: true,
    message: "Post liked successfully",
  });
};

export const unlikePost = async (req, res) => {
  const { postId } = req.params;

  await service.unlikePost(postId, req.user);

  return res.json({
    success: true,
    message: "Post unliked successfully",
  });
};
