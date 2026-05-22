import * as repo from "../repositories/comment-like.repository.js";

const ensureCommentExists = async (commentId) => {
  const comment = await repo.findCommentById(commentId);

  if (!comment) {
    throw new Error("Comment not found");
  }

  return comment;
};

export const likeComment = async (commentId, user) => {
  await ensureCommentExists(commentId);

  const existingLike = await repo.findCommentLike(commentId, user.id);

  if (existingLike) {
    throw new Error("Comment already liked");
  }

  const like = await repo.createCommentLike(commentId, user.id);

  return like;
};

export const unlikeComment = async (commentId, user) => {
  await ensureCommentExists(commentId);

  const existingLike = await repo.findCommentLike(commentId, user.id);

  if (!existingLike) {
    throw new Error("Comment has not been liked");
  }

  await repo.deleteCommentLike(commentId, user.id);

  return true;
};
