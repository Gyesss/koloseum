import { prisma } from "../config/prisma.js";

import * as repo from "../repositories/poll-vote.repository.js";

const ensurePollExists = async (postId) => {
  const poll = await repo.findPollByPostId(postId);

  if (!poll) {
    throw new Error("Poll not found");
  }

  return poll;
};

const validateOptionsBelongToPoll = (poll, optionIds) => {
  const validOptionIds = poll.options.map((option) => option.id);

  const invalidOption = optionIds.find(
    (optionId) => !validOptionIds.includes(optionId),
  );

  if (invalidOption) {
    throw new Error("Invalid poll option");
  }
};

const validateMaxChoices = (poll, optionIds) => {
  if (optionIds.length > poll.maxChoices) {
    throw new Error(`Maximum ${poll.maxChoices} choices allowed`);
  }
};

export const votePoll = async (postId, user, data) => {
  const poll = await ensurePollExists(postId);

  validateOptionsBelongToPoll(poll, data.optionIds);

  validateMaxChoices(poll, data.optionIds);

  await prisma.$transaction([
    prisma.pollVote.deleteMany({
      where: {
        pollId: poll.id,
        userId: user.id,
      },
    }),

    prisma.pollVote.createMany({
      data: data.optionIds.map((optionId) => ({
        pollId: poll.id,
        userId: user.id,
        optionId,
      })),
    }),
  ]);

  return true;
};

export const removeVote = async (postId, user) => {
  const poll = await ensurePollExists(postId);

  const existingVotes = await repo.findVotesByUser(poll.id, user.id);

  if (existingVotes.length === 0) {
    throw new Error("No votes found");
  }

  await repo.deleteVotesByUser(poll.id, user.id);

  return true;
};
