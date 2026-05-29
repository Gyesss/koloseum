import { prisma } from "../config/prisma.js";

export const findPostById = (postId) => {
  return prisma.post.findUnique({
    where: { id: postId },
    include: {
      collaborators: true,
    },
  });
};

export const getCommentsByPostId = async (postId, userId) => {
  const comments = await prisma.comment.findMany({
    where: { postId },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          fullName: true,
          role: true,
          avatarUrl: true,
        },
      },

      commentLikes: {
        select: {
          userId: true,
        },
      },

      _count: {
        select: {
          commentLikes: true,
        },
      },
    },

    orderBy: {
      createdAt: "desc",
    },
  });

  return comments.map((comment) => {
    const likedUserIds = new Set(comment.commentLikes.map((l) => l.userId));

    return {
      ...comment,
      isLiked: userId ? likedUserIds.has(userId) : false,
    };
  });
};

export const createComment = (postId, userId, data) => {
  return prisma.comment.create({
    data: {
      postId,
      userId,
      content: data.content,
    },

    include: {
      user: true,
      _count: {
        select: { commentLikes: true },
      },
    },
  });
};

export const findCommentById = (commentId) => {
  return prisma.comment.findUnique({
    where: { id: commentId },
    include: {
      user: true,
      post: {
        include: {
          collaborators: true,
        },
      },
      _count: {
        select: { commentLikes: true },
      },
    },
  });
};

export const updateComment = (commentId, data) => {
  return prisma.comment.update({
    where: { id: commentId },
    data: { content: data.content },
    include: {
      user: true,
      _count: {
        select: { commentLikes: true },
      },
    },
  });
};

export const deleteComment = (commentId) => {
  return prisma.comment.delete({
    where: { id: commentId },
  });
};
