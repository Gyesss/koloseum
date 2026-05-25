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

export const findUserById = (userId) => {
  return prisma.user.findUnique({
    where: {
      id: userId,
    },

    select: {
      id: true,

      avatarUrl: true,
      avatarPath: true,

      bannerUrl: true,
      bannerPath: true,
    },
  });
};

export const updateUserMedia = (id, data) => {
  return prisma.user.update({
    where: { id },
    data,
    select: {
      id: true,
      avatarUrl: true,
      bannerUrl: true,
    },
  });
};

export const findEventById = (eventId) => {
  return prisma.event.findUnique({
    where: {
      id: eventId,
    },

    select: {
      id: true,

      bannerUrl: true,
      bannerPath: true,
    },
  });
};

export const updateEventMedia = (id, data) => {
  return prisma.event.update({
    where: { id },
    data,
    select: {
      id: true,
      bannerUrl: true,
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

export const updateUserAvatar = (userId, data) => {
  return prisma.user.update({
    where: {
      id: userId,
    },

    data: {
      avatarUrl: data.url,
      avatarPath: data.path,
    },

    select: {
      id: true,

      username: true,
      fullName: true,

      avatarUrl: true,
      avatarPath: true,
    },
  });
};

export const updateUserBanner = (userId, data) => {
  return prisma.user.update({
    where: {
      id: userId,
    },

    data: {
      bannerUrl: data.url,
      bannerPath: data.path,
    },

    select: {
      id: true,

      username: true,
      fullName: true,

      bannerUrl: true,
      bannerPath: true,
    },
  });
};

export const updateEventBanner = (eventId, data) => {
  return prisma.event.update({
    where: {
      id: eventId,
    },

    data: {
      bannerUrl: data.url,
      bannerPath: data.path,
    },

    select: {
      id: true,

      name: true,

      bannerUrl: true,
      bannerPath: true,
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
