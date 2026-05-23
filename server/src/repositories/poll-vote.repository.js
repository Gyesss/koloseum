import { prisma } from "../config/prisma.js";

export const findPollByPostId = (postId) => {
  return prisma.poll.findUnique({
    where: {
      postId,
    },

    include: {
      options: true,
    },
  });
};

export const findVotesByUser = (pollId, userId) => {
  return prisma.pollVote.findMany({
    where: {
      pollId,
      userId,
    },
  });
};

export const deleteVotesByUser = (pollId, userId) => {
  return prisma.pollVote.deleteMany({
    where: {
      pollId,
      userId,
    },
  });
};

export const createVotes = (pollId, userId, optionIds) => {
  return prisma.pollVote.createMany({
    data: optionIds.map((optionId) => ({
      pollId,
      userId,
      optionId,
    })),
  });
};
