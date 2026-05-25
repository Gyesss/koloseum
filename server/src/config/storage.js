import crypto from "crypto";

import { supabase } from "./supabase.js";

export const generateFileName = (file) => {
  const random = crypto.randomBytes(16).toString("hex");

  const extension = file.originalname.split(".").pop();

  return `${Date.now()}-${random}.${extension}`;
};

export const uploadFile = async ({ bucket, file, folder = "" }) => {
  const fileName = generateFileName(file);

  const filePath = folder ? `${folder}/${fileName}` : fileName;

  const { error } = await supabase.storage
    .from(bucket)
    .upload(filePath, file.buffer, {
      contentType: file.mimetype,
      upsert: false,
    });

  if (error) {
    throw new Error(error.message);
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(bucket).getPublicUrl(filePath);

  return {
    fileName,
    filePath,
    publicUrl,
  };
};

export const deleteFile = async ({ bucket, filePath }) => {
  const { error } = await supabase.storage.from(bucket).remove([filePath]);

  if (error) {
    throw new Error(error.message);
  }
};
