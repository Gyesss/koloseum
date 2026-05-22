import { prisma } from "../config/prisma.js";

export const createQna = (eventId, data) => {
  return prisma.qna.create({
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

      question: true,
      answer: true,

      createdAt: true,
      updatedAt: true,
    },
  });
};

export const findQnasByEventId = (eventId) => {
  return prisma.qna.findMany({
    where: {
      eventId,
    },

    orderBy: {
      createdAt: "asc",
    },

    select: {
      id: true,

      question: true,
      answer: true,

      createdAt: true,
      updatedAt: true,
    },
  });
};

export const findQnaById = (id) => {
  return prisma.qna.findUnique({
    where: {
      id,
    },

    include: {
      event: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
};

export const updateQnaById = (id, data) => {
  return prisma.qna.update({
    where: {
      id,
    },

    data,

    select: {
      id: true,
      eventId: true,

      question: true,
      answer: true,

      updatedAt: true,
    },
  });
};

export const deleteQnaById = (id) => {
  return prisma.qna.delete({
    where: {
      id,
    },
  });
};
