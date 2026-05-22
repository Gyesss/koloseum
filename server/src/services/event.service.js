import * as repo from "../repositories/event.repository.js";

/**
 * RULES (domain level):
 * - startAt harus < endAt
 * - hanya ADMIN / ORGANIZER yang boleh create event (sementara enforce di controller/middleware nanti)
 */

export const createEvent = async (data, user) => {
  if (new Date(data.startAt) >= new Date(data.endAt)) {
    throw new Error("startAt must be earlier than endAt");
  }

  const event = await repo.createEvent(data, user.id);
  return event;
};

export const getEvents = async () => {
  const events = await repo.findEvents();
  return events;
};

export const getEventById = async (id) => {
  const event = await repo.findEventById(id);

  if (!event) {
    throw new Error("Event not found");
  }

  return event;
};

export const updateEvent = async (id, data) => {
  if (data.startAt && data.endAt) {
    if (new Date(data.startAt) >= new Date(data.endAt)) {
      throw new Error("startAt must be earlier than endAt");
    }
  }

  const existing = await repo.findEventById(id);

  if (!existing) {
    throw new Error("Event not found");
  }

  const updated = await repo.updateEventById(id, data);
  return updated;
};

export const deleteEvent = async (id) => {
  const existing = await repo.findEventById(id);

  if (!existing) {
    throw new Error("Event not found");
  }

  await repo.deleteEventById(id);

  return true;
};
