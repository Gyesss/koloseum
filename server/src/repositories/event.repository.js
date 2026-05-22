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
      location: true,
      startAt: true,
      endAt: true,
      mood: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const findEventById = (id) => {
  return prisma.event.findUnique({
    where: { id },
    include: {
      users: {
        select: {
          id: true,
          username: true,
          fullName: true,
          role: true,
        },
      },
      timelines: true,
      qnas: true,
    },
  });
};

export const updateEventById = (id, data) => {
  return prisma.event.update({
    where: { id },
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
      updatedAt: true,
    },
  });
};

export const deleteEventById = (id) => {
  return prisma.event.delete({
    where: { id },
  });
};
