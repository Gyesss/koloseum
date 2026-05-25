import { uploadFile, deleteFile } from "../config/storage.js";

import {
  findUserById,
  updateUserMedia,
  findEventById,
  updateEventMedia,
  createMedia,
  countMediaByPostId,
  findPostById,
} from "../repositories/media.repository.js";

import { MEDIA_BUCKET } from "../constants/media.constant.js";

const MAX_POST_MEDIA = 10;

/**
 * =========================
 * POST MEDIA (MULTIPLE)
 * =========================
 */
export const uploadPostMedia = async (postId, file) => {
  const post = await findPostById(postId);

  if (!post) {
    throw new Error("Post not found");
  }

  const mediaCount = await countMediaByPostId(postId);

  if (mediaCount >= MAX_POST_MEDIA) {
    throw new Error("Maximum media reached");
  }

  const uploadedFile = await uploadFile({
    bucket: MEDIA_BUCKET.POSTS,
    file,
    folder: `posts/${postId}`,
  });

  return createMedia(postId, {
    url: uploadedFile.publicUrl,
    path: uploadedFile.filePath,
    name: file.originalname,
    mimeType: file.mimetype,
    size: file.size,
  });
};

/**
 * =========================
 * USER AVATAR (REPLACE)
 * =========================
 */
export const uploadUserAvatar = async (userId, file) => {
  const user = await findUserById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  // delete old file if exists
  if (user.avatarPath) {
    await deleteFile({
      bucket: MEDIA_BUCKET.AVATARS,
      filePath: user.avatarPath,
    });
  }

  const uploadedFile = await uploadFile({
    bucket: MEDIA_BUCKET.AVATARS,
    file,
    folder: `users/${userId}/avatar`,
  });

  return updateUserMedia(userId, {
    avatarUrl: uploadedFile.publicUrl,
    avatarPath: uploadedFile.filePath,
  });
};

/**
 * =========================
 * USER BANNER (REPLACE)
 * =========================
 */
export const uploadUserBanner = async (userId, file) => {
  const user = await findUserById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  if (user.bannerPath) {
    await deleteFile({
      bucket: MEDIA_BUCKET.BANNERS,
      filePath: user.bannerPath,
    });
  }

  const uploadedFile = await uploadFile({
    bucket: MEDIA_BUCKET.BANNERS,
    file,
    folder: `users/${userId}/banner`,
  });

  return updateUserMedia(userId, {
    bannerUrl: uploadedFile.publicUrl,
    bannerPath: uploadedFile.filePath,
  });
};

/**
 * =========================
 * EVENT BANNER (REPLACE)
 * =========================
 */
export const uploadEventBanner = async (eventId, file) => {
  const event = await findEventById(eventId);

  if (!event) {
    throw new Error("Event not found");
  }

  if (event.bannerPath) {
    await deleteFile({
      bucket: MEDIA_BUCKET.BANNERS,
      filePath: event.bannerPath,
    });
  }

  const uploadedFile = await uploadFile({
    bucket: MEDIA_BUCKET.BANNERS,
    file,
    folder: `events/${eventId}/banner`,
  });

  return updateEventMedia(eventId, {
    bannerUrl: uploadedFile.publicUrl,
    bannerPath: uploadedFile.filePath,
  });
};
