import * as service from "../services/timeline.service.js";
import * as validator from "../validators/timeline.validator.js";

export const createTimeline = async (req, res) => {
  const parsed = validator.createTimelineSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      message: parsed.error.errors,
    });
  }

  const { eventId } = req.params;

  const result = await service.createTimeline(eventId, parsed.data);

  return res.status(201).json({
    success: true,
    message: "Timeline created successfully",
    data: result,
  });
};

export const getTimelinesByEventId = async (req, res) => {
  const { eventId } = req.params;

  const result = await service.getTimelinesByEventId(eventId);

  return res.json({
    success: true,
    data: result,
  });
};

export const updateTimeline = async (req, res) => {
  const parsed = validator.updateTimelineSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      message: parsed.error.errors,
    });
  }

  const { timelineId } = req.params;

  const result = await service.updateTimeline(timelineId, parsed.data);

  return res.json({
    success: true,
    message: "Timeline updated successfully",
    data: result,
  });
};

export const deleteTimeline = async (req, res) => {
  const { timelineId } = req.params;

  await service.deleteTimeline(timelineId);

  return res.json({
    success: true,
    message: "Timeline deleted successfully",
  });
};
