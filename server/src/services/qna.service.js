import * as qnaRepo from "../repositories/qna.repository.js";
import * as eventRepo from "../repositories/event.repository.js";

export const createQna = async (eventId, data) => {
  const event = await eventRepo.findEventById(eventId);

  if (!event) {
    throw new Error("Event not found");
  }

  const qna = await qnaRepo.createQna(eventId, data);

  return qna;
};

export const getQnasByEventId = async (eventId) => {
  const event = await eventRepo.findEventById(eventId);

  if (!event) {
    throw new Error("Event not found");
  }

  const qnas = await qnaRepo.findQnasByEventId(eventId);

  return qnas;
};

export const updateQna = async (eventId, qnaId, data) => {
  const existing = await qnaRepo.findQnaById(qnaId);

  if (!existing) {
    throw new Error("QnA not found");
  }

  if (existing.eventId !== eventId) {
    throw new Error("QnA does not belong to this event");
  }

  const updated = await qnaRepo.updateQnaById(qnaId, data);

  return updated;
};

export const deleteQna = async (eventId, qnaId) => {
  const existing = await qnaRepo.findQnaById(qnaId);

  if (!existing) {
    throw new Error("QnA not found");
  }

  if (existing.eventId !== eventId) {
    throw new Error("QnA does not belong to this event");
  }

  await qnaRepo.deleteQnaById(qnaId);

  return true;
};
