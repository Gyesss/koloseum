import { prisma } from "../config/prisma.js";

import * as repo from "../repositories/poll.repository.js";

const ensurePostExists = async (postId) => {
  const post = await repo.findPostById(postId);

  if (!post) {
    throw new Error("Post not found");
  }

  return post;
};

const ensureCanManagePoll = (post, user) => {
  if (user.role === "ADMIN") {
    return true;
  }

  const collaborator = post.collaborators.find(
    (item) => item.userId === user.id,
  );

  if (!collaborator) {
    throw new Error("Forbidden");
  }

  if (!collaborator.isOwner) {
    throw new Error("Only post owner can manage poll");
  }

  return true;
};

export const createPoll = async (postId, user, data) => {
  const post = await ensurePostExists(postId);

  ensureCanManagePoll(post, user);

  if (post.poll) {
    throw new Error("Post already has a poll");
  }

  const poll = await repo.createPoll({
    postId,
    question: data.question,
    maxChoices: data.maxChoices,
    options: data.options,
  });

  return poll;
};

export const getPoll = async (postId) => {
  await ensurePostExists(postId);

  const poll = await repo.findPollByPostId(postId);

  if (!poll) {
    throw new Error("Poll not found");
  }

  return poll;
};

export const deletePoll = async (postId, user) => {
  const post = await ensurePostExists(postId);

  ensureCanManagePoll(post, user);

  if (!post.poll) {
    throw new Error("Poll not found");
  }

  await prisma.$transaction([
    prisma.pollVote.deleteMany({
      where: {
        pollId: post.poll.id,
      },
    }),

    prisma.pollOption.deleteMany({
      where: {
        pollId: post.poll.id,
      },
    }),

    prisma.poll.delete({
      where: {
        id: post.poll.id,
      },
    }),
  ]);

  return true;
};
