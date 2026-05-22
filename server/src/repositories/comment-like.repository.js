import { prisma } from "../config/prisma.js";

export const findCommentById = (commentId) => {
  return prisma.comment.findUnique({
    where: {
      id: commentId,
    },
  });
};

export const findCommentLike = (commentId, userId) => {
  return prisma.commentLike.findUnique({
    where: {
      userId_commentId: {
        userId,
        commentId,
      },
    },
  });
};

export const createCommentLike = (commentId, userId) => {
  return prisma.commentLike.create({
    data: {
      commentId,
      userId,
    },
  });
};

export const deleteCommentLike = (commentId, userId) => {
  return prisma.commentLike.delete({
    where: {
      userId_commentId: {
        userId,
        commentId,
      },
    },
  });
};
