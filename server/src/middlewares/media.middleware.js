import multer from "multer";

import {
  IMAGE_MIME_TYPES,
  POST_MEDIA_MIME_TYPES,
  MAX_AVATAR_SIZE,
  MAX_BANNER_SIZE,
  MAX_POST_MEDIA_SIZE,
} from "../constants/media.constant.js";

const storage = multer.memoryStorage();

const imageFileFilter = (req, file, cb) => {
  const isAllowed = IMAGE_MIME_TYPES.includes(file.mimetype);

  if (!isAllowed) {
    return cb(new Error("Unsupported file type"));
  }

  cb(null, true);
};

const postMediaFileFilter = (req, file, cb) => {
  const isAllowed = POST_MEDIA_MIME_TYPES.includes(file.mimetype);

  if (!isAllowed) {
    return cb(new Error("Unsupported file type"));
  }

  cb(null, true);
};

export const uploadAvatarMiddleware = multer({
  storage,

  limits: {
    fileSize: MAX_AVATAR_SIZE,
  },

  fileFilter: imageFileFilter,
});

export const uploadBannerMiddleware = multer({
  storage,

  limits: {
    fileSize: MAX_BANNER_SIZE,
  },

  fileFilter: imageFileFilter,
});

export const uploadPostMediaMiddleware = multer({
  storage,

  limits: {
    fileSize: MAX_POST_MEDIA_SIZE,
  },

  fileFilter: postMediaFileFilter,
});
