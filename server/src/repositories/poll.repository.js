import { prisma } from "../config/prisma.js";

export const findPostById = (postId) => {
  return prisma.post.findUnique({
    where: {
      id: postId,
    },
    include: {
      collaborators: true,
      poll: true,
    },
  });
};

export const createPoll = ({ postId, question, maxChoices, options }) => {
  return prisma.poll.create({
    data: {
      postId,
      question,
      maxChoices,

      options: {
        create: options.map((option) => ({
          value: option,
        })),
      },
    },

    include: {
      options: true,
    },
  });
};

export const findPollByPostId = (postId) => {
  return prisma.poll.findUnique({
    where: {
      postId,
    },

    include: {
      options: {
        include: {
          _count: {
            select: {
              votes: true,
            },
          },
        },
      },

      _count: {
        select: {
          votes: true,
        },
      },
    },
  });
};

export const findPollById = (pollId) => {
  return prisma.poll.findUnique({
    where: {
      id: pollId,
    },

    include: {
      options: true,
    },
  });
};

export const deletePoll = (pollId) => {
  return prisma.poll.delete({
    where: {
      id: pollId,
    },
  });
};
