import * as service from "../services/event.service.js";
import * as validator from "../validators/event.validator.js";

export const createEvent = async (req, res) => {
  const parsed = validator.createEventSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      message: parsed.error.errors,
    });
  }

  const result = await service.createEvent(parsed.data, req.user);

  return res.status(201).json({
    success: true,
    message: "Event created successfully",
    data: result,
  });
};

export const getEvents = async (req, res) => {
  const result = await service.getEvents();

  return res.json({
    success: true,
    data: result,
  });
};

export const getEventById = async (req, res) => {
  const { id } = req.params;

  const result = await service.getEventById(id);

  return res.json({
    success: true,
    data: result,
  });
};

export const updateEvent = async (req, res) => {
  const parsed = validator.updateEventSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      message: parsed.error.errors,
    });
  }

  const { id } = req.params;

  const result = await service.updateEvent(id, parsed.data);

  return res.json({
    success: true,
    message: "Event updated successfully",
    data: result,
  });
};

export const deleteEvent = async (req, res) => {
  const { id } = req.params;

  await service.deleteEvent(id);

  return res.json({
    success: true,
    message: "Event deleted successfully",
  });
};
