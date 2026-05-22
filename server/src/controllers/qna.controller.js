import * as service from "../services/qna.service.js";
import * as validator from "../validators/qna.validator.js";

export const createQna = async (req, res) => {
  const parsed = validator.createQnaSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      message: parsed.error.errors,
    });
  }

  const { eventId } = req.params;

  const result = await service.createQna(eventId, parsed.data);

  return res.status(201).json({
    success: true,
    message: "QnA created successfully",
    data: result,
  });
};

export const getQnasByEventId = async (req, res) => {
  const { eventId } = req.params;

  const result = await service.getQnasByEventId(eventId);

  return res.json({
    success: true,
    data: result,
  });
};

export const updateQna = async (req, res) => {
  const parsed = validator.updateQnaSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      message: parsed.error.errors,
    });
  }

  const { eventId, qnaId } = req.params;

  const result = await service.updateQna(eventId, qnaId, parsed.data);

  return res.json({
    success: true,
    message: "QnA updated successfully",
    data: result,
  });
};

export const deleteQna = async (req, res) => {
  const { eventId, qnaId } = req.params;

  await service.deleteQna(eventId, qnaId);

  return res.json({
    success: true,
    message: "QnA deleted successfully",
  });
};
