import { prisma } from "../config/prisma.js";

export const createEvent = (data, userId) => {
  return prisma.event.create({
    data: {
      ...data,
      users: {
        connect: {
          id: userId,
        },
      },
    },
    select: {
      id: true,
      name: true,
      tagline: true,
      description: true,
      location: true,
      startAt: true,
      endAt: true,
      mood: true,
      bannerUrl: true,
      bannerPath: true,
      createdAt: true,
    },
  });
};

export const findEvents = () => {
  return prisma.event.findMany({
    select: {
      id: true,
      name: true,
      tagline: true,
      description: true,
      location: true,
      startAt: true,
      endAt: true,
      mood: true,
      bannerUrl: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const findEventById = (id) => {
  return prisma.event.findUnique({
    where: {
      id,
    },

    include: {
      users: {
        select: {
          id: true,
          username: true,
          fullName: true,
          role: true,
          avatarUrl: true,
        },
      },
      timelines: true,
      qnas: true,
    },
  });
};

export const updateEventById = (id, data) => {
  return prisma.event.update({
    where: {
      id,
    },

    data,
    select: {
      id: true,
      name: true,
      tagline: true,
      description: true,
      location: true,
      startAt: true,
      endAt: true,
      mood: true,
      bannerUrl: true,
      bannerPath: true,
      updatedAt: true,
    },
  });
};

export const deleteEventById = (id) => {
  return prisma.event.delete({
    where: {
      id,
    },
  });
};
