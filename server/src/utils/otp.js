import { randomInt, createHash } from "crypto";

export const generateOtp = () => {
  return randomInt(100000, 999999).toString();
};

export const hashOtp = (otp) => {
  return createHash("sha256").update(otp).digest("hex");
};
