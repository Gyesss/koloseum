import { uploadPostMedia } from "../services/media.service.js";

export const uploadPostMediaController = async (req, res, next) => {
  try {
    const { postId } = req.params;

    if (!req.file) {
      return res.status(400).json({
        message: "File is required",
      });
    }

    const media = await uploadPostMedia(postId, req.file);

    return res.status(201).json({
      message: "Media uploaded successfully",
      data: media,
    });
  } catch (error) {
    next(error);
  }
};
