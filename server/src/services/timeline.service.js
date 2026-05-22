import * as timelineRepo from "../repositories/timeline.repository.js";
import * as eventRepo from "../repositories/event.repository.js";

export const createTimeline = async (eventId, data) => {
  const event = await eventRepo.findEventById(eventId);

  if (!event) {
    throw new Error("Event not found");
  }

  if (new Date(data.startAt) >= new Date(data.endAt)) {
    throw new Error("startAt must be earlier than endAt");
  }

  if (
    new Date(data.startAt) < new Date(event.startAt) ||
    new Date(data.endAt) > new Date(event.endAt)
  ) {
    throw new Error("Timeline must be within event duration");
  }

  const timeline = await timelineRepo.createTimeline(eventId, data);

  return timeline;
};

export const getTimelinesByEventId = async (eventId) => {
  const event = await eventRepo.findEventById(eventId);

  if (!event) {
    throw new Error("Event not found");
  }

  const timelines = await timelineRepo.findTimelinesByEventId(eventId);

  return timelines;
};

export const updateTimeline = async (timelineId, data) => {
  const existing = await timelineRepo.findTimelineById(timelineId);

  if (!existing) {
    throw new Error("Timeline not found");
  }

  const nextStartAt = data.startAt || existing.startAt;
  const nextEndAt = data.endAt || existing.endAt;

  if (new Date(nextStartAt) >= new Date(nextEndAt)) {
    throw new Error("startAt must be earlier than endAt");
  }

  if (
    new Date(nextStartAt) < new Date(existing.event.startAt) ||
    new Date(nextEndAt) > new Date(existing.event.endAt)
  ) {
    throw new Error("Timeline must be within event duration");
  }

  const updated = await timelineRepo.updateTimelineById(timelineId, data);

  return updated;
};

export const deleteTimeline = async (timelineId) => {
  const existing = await timelineRepo.findTimelineById(timelineId);

  if (!existing) {
    throw new Error("Timeline not found");
  }

  await timelineRepo.deleteTimelineById(timelineId);

  return true;
};
