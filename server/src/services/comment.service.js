import * as repo from "../repositories/comment.repository.js";

const ensurePostExists = async (postId) => {
  const post = await repo.findPostById(postId);

  if (!post) throw new Error("Post not found");

  return post;
};

const ensureCommentExists = async (commentId) => {
  const comment = await repo.findCommentById(commentId);

  if (!comment) throw new Error("Comment not found");

  return comment;
};

const isPostOwner = (post, userId) => {
  return post.collaborators.some((c) => c.userId === userId && c.isOwner);
};

export const createComment = async (postId, user, data) => {
  await ensurePostExists(postId);

  return repo.createComment(postId, user.id, data);
};

export const getComments = async (postId, userId) => {
  await ensurePostExists(postId);

  return repo.getCommentsByPostId(postId, userId);
};

export const updateComment = async (commentId, user, data) => {
  const comment = await ensureCommentExists(commentId);

  const isAdmin = user.role === "ADMIN";
  const isOwner = comment.userId === user.id;

  if (!isOwner && !isAdmin) {
    throw new Error("You are not allowed to update this comment");
  }

  return repo.updateComment(commentId, data);
};

export const deleteComment = async (commentId, user) => {
  const comment = await ensureCommentExists(commentId);

  const isAdmin = user.role === "ADMIN";
  const isCommentOwner = comment.userId === user.id;
  const isModerator = isPostOwner(comment.post, user.id);

  if (!isAdmin && !isCommentOwner && !isModerator) {
    throw new Error("You are not allowed to delete this comment");
  }

  await repo.deleteComment(commentId);

  return true;
};
