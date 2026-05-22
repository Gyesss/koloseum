import { prisma } from "../config/prisma.js";

export const findPostById = (postId) => {
  return prisma.post.findUnique({
    where: {
      id: postId,
    },

    include: {
      collaborators: true,
    },
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
      user: {
        select: {
          id: true,
          username: true,
          fullName: true,
          role: true,
        },
      },

      _count: {
        select: {
          commentLikes: true,
        },
      },
    },
  });
};

export const findCommentById = (commentId) => {
  return prisma.comment.findUnique({
    where: {
      id: commentId,
    },

    include: {
      user: {
        select: {
          id: true,
          username: true,
          fullName: true,
          role: true,
        },
      },

      post: {
        include: {
          collaborators: true,
        },
      },

      _count: {
        select: {
          commentLikes: true,
        },
      },
    },
  });
};

export const getCommentsByPostId = (postId) => {
  return prisma.comment.findMany({
    where: {
      postId,
    },

    include: {
      user: {
        select: {
          id: true,
          username: true,
          fullName: true,
          role: true,
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
};

export const updateComment = (commentId, data) => {
  return prisma.comment.update({
    where: {
      id: commentId,
    },

    data: {
      content: data.content,
    },

    include: {
      user: {
        select: {
          id: true,
          username: true,
          fullName: true,
          role: true,
        },
      },

      _count: {
        select: {
          commentLikes: true,
        },
      },
    },
  });
};

export const deleteComment = (commentId) => {
  return prisma.comment.delete({
    where: {
      id: commentId,
    },
  });
};
