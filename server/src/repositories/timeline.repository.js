import { prisma } from "../config/prisma.js";

export const createTimeline = (eventId, data) => {
  return prisma.timeline.create({
    data: {
      ...data,
      event: {
        connect: {
          id: eventId,
        },
      },
    },

    select: {
      id: true,
      eventId: true,

      name: true,
      additional: true,
      type: true,

      startAt: true,
      endAt: true,

      createdAt: true,
    },
  });
};

export const findTimelinesByEventId = (eventId) => {
  return prisma.timeline.findMany({
    where: {
      eventId,
    },

    orderBy: {
      startAt: "asc",
    },

    select: {
      id: true,

      name: true,
      additional: true,
      type: true,

      startAt: true,
      endAt: true,

      createdAt: true,
      updatedAt: true,
    },
  });
};

export const findTimelineById = (id) => {
  return prisma.timeline.findUnique({
    where: {
      id,
    },

    include: {
      event: {
        select: {
          id: true,
          name: true,
          startAt: true,
          endAt: true,
        },
      },
    },
  });
};

export const updateTimelineById = (id, data) => {
  return prisma.timeline.update({
    where: {
      id,
    },

    data,

    select: {
      id: true,
      eventId: true,

      name: true,
      additional: true,
      type: true,

      startAt: true,
      endAt: true,

      updatedAt: true,
    },
  });
};

export const deleteTimelineById = (id) => {
  return prisma.timeline.delete({
    where: {
      id,
    },
  });
};
