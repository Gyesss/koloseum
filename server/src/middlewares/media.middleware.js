import multer from "multer";

import {
  POST_MEDIA_MIME_TYPES,
  MAX_POST_MEDIA_SIZE,
} from "../constants/media.constant.js";

const storage = multer.memoryStorage();

export const uploadPostMediaMiddleware = multer({
  storage,

  limits: {
    fileSize: MAX_POST_MEDIA_SIZE,
  },

  fileFilter: (req, file, cb) => {
    const isAllowed = POST_MEDIA_MIME_TYPES.includes(file.mimetype);

    if (!isAllowed) {
      return cb(new Error("Unsupported file type"));
    }

    cb(null, true);
  },
});
