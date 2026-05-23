import * as service from "../services/poll-vote.service.js";

import * as validator from "../validators/poll.validator.js";

export const votePoll = async (req, res) => {
  const parsed = validator.votePollSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      message: parsed.error.errors,
    });
  }

  const { postId } = req.params;

  await service.votePoll(postId, req.user, parsed.data);

  return res.status(201).json({
    success: true,
    message: "Poll voted successfully",
  });
};

export const removeVote = async (req, res) => {
  const { postId } = req.params;

  await service.removeVote(postId, req.user);

  return res.json({
    success: true,
    message: "Poll vote removed successfully",
  });
};
