import * as service from "../services/poll.service.js";

import * as validator from "../validators/poll.validator.js";

export const createPoll = async (req, res) => {
  const parsed = validator.createPollSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      message: parsed.error.errors,
    });
  }

  const { postId } = req.params;

  const result = await service.createPoll(postId, req.user, parsed.data);

  return res.status(201).json({
    success: true,
    message: "Poll created successfully",
    data: result,
  });
};

export const getPoll = async (req, res) => {
  const { postId } = req.params;

  const result = await service.getPoll(postId);

  return res.json({
    success: true,
    data: result,
  });
};

export const deletePoll = async (req, res) => {
  const { postId } = req.params;

  await service.deletePoll(postId, req.user);

  return res.json({
    success: true,
    message: "Poll deleted successfully",
  });
};
