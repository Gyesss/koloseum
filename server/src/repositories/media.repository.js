import { prisma } from "../config/prisma.js";

export const findPostById = (postId) => {
  return prisma.post.findUnique({
    where: {
      id: postId,
    },

    select: {
      id: true,
    },
  });
};

export const countMediaByPostId = (postId) => {
  return prisma.media.count({
    where: {
      postId,
    },
  });
};

export const createMedia = (postId, data) => {
  return prisma.media.create({
    data: {
      postId,

      url: data.url,
      path: data.path,

      name: data.name,
      mimeType: data.mimeType,
      size: data.size,
    },

    select: {
      id: true,

      postId: true,

      url: true,
      path: true,

      name: true,
      mimeType: true,
      size: true,

      createdAt: true,
    },
  });
};

export const findMediaById = (id) => {
  return prisma.media.findUnique({
    where: {
      id,
    },

    select: {
      id: true,

      postId: true,

      url: true,
      path: true,

      name: true,
      mimeType: true,
      size: true,

      createdAt: true,
      updatedAt: true,
    },
  });
};

export const findMediaByPostId = (postId) => {
  return prisma.media.findMany({
    where: {
      postId,
    },

    select: {
      id: true,

      url: true,
      path: true,

      name: true,
      mimeType: true,
      size: true,

      createdAt: true,
    },

    orderBy: {
      createdAt: "asc",
    },
  });
};

export const deleteMediaById = (id) => {
  return prisma.media.delete({
    where: {
      id,
    },
  });
};
