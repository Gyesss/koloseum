import * as service from "../services/post.service.js";
import * as validator from "../validators/post.validator.js";

export const createPost = async (req, res) => {
  const parsed = validator.createPostSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      message: parsed.error.errors,
    });
  }

  const { eventId } = req.params;

  const result = await service.createPost(eventId, req.user, parsed.data);

  return res.status(201).json({
    success: true,
    message: "Post created successfully",
    data: result,
  });
};

export const getPostsByEventId = async (req, res) => {
  const { eventId } = req.params;

  const userId = req.user ? req.user.id : null;

  const result = await service.getPostsByEventId(eventId, userId);

  return res.json({
    success: true,
    data: result,
  });
};

export const getPostById = async (req, res) => {
  const { eventId, postId } = req.params;

  const userId = req.user ? req.user.id : null;

  const result = await service.getPostById(eventId, postId, userId);

  return res.json({
    success: true,
    data: result,
  });
};

export const updatePost = async (req, res) => {
  const parsed = validator.updatePostSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      message: parsed.error.errors,
    });
  }

  const { eventId, postId } = req.params;

  const result = await service.updatePost(
    eventId,
    postId,
    req.user,
    parsed.data,
  );

  return res.json({
    success: true,
    message: "Post updated successfully",
    data: result,
  });
};

export const deletePost = async (req, res) => {
  const { eventId, postId } = req.params;

  await service.deletePost(eventId, postId, req.user);

  return res.json({
    success: true,
    message: "Post deleted successfully",
  });
};
