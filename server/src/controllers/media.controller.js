import * as service from "../services/media.service.js";

export const uploadPostMediaController = async (req, res, next) => {
  try {
    const { postId } = req.params;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "File is required",
      });
    }

    const result = await service.uploadPostMedia(postId, req.file);

    return res.status(201).json({
      success: true,
      message: "Post media uploaded successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

export const uploadUserAvatarController = async (req, res, next) => {
  try {
    const userId = req.user.id;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "File is required",
      });
    }

    const result = await service.uploadUserAvatar(userId, req.file);

    return res.status(200).json({
      success: true,
      message: "Avatar updated successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

export const uploadUserBannerController = async (req, res, next) => {
  try {
    const userId = req.user.id;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "File is required",
      });
    }

    const result = await service.uploadUserBanner(userId, req.file);

    return res.status(200).json({
      success: true,
      message: "User banner updated successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

export const uploadEventBannerController = async (req, res, next) => {
  try {
    const { eventId } = req.params;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "File is required",
      });
    }

    const result = await service.uploadEventBanner(eventId, req.file);

    return res.status(200).json({
      success: true,
      message: "Event banner updated successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};
