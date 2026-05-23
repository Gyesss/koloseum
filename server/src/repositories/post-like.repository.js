import { prisma } from "../config/prisma.js";

export const findPostById = (postId) => {
  return prisma.post.findUnique({
    where: {
      id: postId,
    },
  });
};

export const findPostLike = (postId, userId) => {
  return prisma.postLike.findUnique({
    where: {
      userId_postId: {
        userId,
        postId,
      },
    },
  });
};

export const createPostLike = (postId, userId) => {
  return prisma.postLike.create({
    data: {
      postId,
      userId,
    },
  });
};

export const deletePostLike = (postId, userId) => {
  return prisma.postLike.delete({
    where: {
      userId_postId: {
        userId,
        postId,
      },
    },
  });
};
