import { uploadFile } from "../config/storage.js";

import {
  createMedia,
  countMediaByPostId,
  findPostById,
} from "../repositories/media.repository.js";

import { MEDIA_BUCKET } from "../constants/media.constant.js";

const MAX_POST_MEDIA = 10;

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
