import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faRotateRight } from "@fortawesome/free-solid-svg-icons";

import { verifyEmail, resendOtp } from "../api/auth";

const RESEND_COOLDOWN = 60;
const OTP_LENGTH = 6;

export default function VerifyEmail() {
  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email || "";

  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [countdown, setCountdown] = useState(RESEND_COOLDOWN);

  const inputRefs = useRef([]);

  // Redirect if no email in state
  useEffect(() => {
    if (!email) {
      navigate("/login", { replace: true });
    }
  }, [email, navigate]);

  // Resend cooldown timer
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  const focusInput = (index) => {
    inputRefs.current[index]?.focus();
  };

  const handleOtpChange = (e, index) => {
    const val = e.target.value.replace(/\D/g, "").slice(-1);
    const updated = [...otp];
    updated[index] = val;
    setOtp(updated);

    if (val && index < OTP_LENGTH - 1) {
      focusInput(index + 1);
    }
  };

  const handleOtpKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (otp[index]) {
        const updated = [...otp];
        updated[index] = "";
        setOtp(updated);
      } else if (index > 0) {
        focusInput(index - 1);
      }
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH);
    if (!pasted) return;

    const updated = Array(OTP_LENGTH).fill("");
    pasted.split("").forEach((char, i) => {
      updated[i] = char;
    });
    setOtp(updated);
    focusInput(Math.min(pasted.length, OTP_LENGTH - 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const code = otp.join("");
    if (code.length < OTP_LENGTH) {
      setError("Please enter the complete 6-digit OTP.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await verifyEmail({ email, otp: code });
      navigate("/login", {
        state: { verified: true },
      });
    } catch (err) {
      console.error(err);
      setError(
        err?.response?.data?.message ||
          "Verification failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (countdown > 0 || resending) return;

    setResending(true);
    setError("");
    setSuccess("");

    try {
      await resendOtp({ email });
      setSuccess("A new OTP has been sent to your email.");
      setCountdown(RESEND_COOLDOWN);
      setOtp(Array(OTP_LENGTH).fill(""));
      focusInput(0);
    } catch (err) {
      console.error(err);
      setError(
        err?.response?.data?.message ||
          "Failed to resend OTP. Please try again.",
      );
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="bg-background flex min-h-dvh items-center justify-center px-6 py-12">
      <div className="bg-surface border-border rounded-card w-full max-w-md overflow-hidden border shadow-sm">
        {/* Top Accent */}
        <div className="from-border via-brand to-accent h-2 w-full bg-linear-to-r" />

        <div className="p-8 sm:p-10">
          {/* Heading */}
          <div className="mb-8 text-center">
            <p className="text-brand mb-3 text-sm font-semibold tracking-[0.35em] uppercase">
              Koloseum
            </p>

            <h1 className="font-heading text-text text-4xl font-semibold tracking-tight">
              Verify Your Email
            </h1>

            <p className="text-text-soft font-body mt-4 text-sm leading-7">
              We sent a 6-digit code to{" "}
              <span className="text-text font-medium">{email}</span>. Enter it
              below to activate your account.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-background border-border text-text rounded-base mb-6 border px-4 py-3 text-sm">
              {error}
            </div>
          )}

          {/* Success */}
          {success && (
            <div className="bg-background border-border text-brand rounded-base mb-6 border px-4 py-3 text-sm">
              {success}
            </div>
          )}

          {/* OTP Inputs */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-center gap-3">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(e, index)}
                  onKeyDown={(e) => handleOtpKeyDown(e, index)}
                  onPaste={handleOtpPaste}
                  className="bg-background border-border text-text focus:border-brand rounded-base h-14 w-12 border text-center text-xl font-semibold transition-colors outline-none"
                />
              ))}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="bg-brand rounded-base inline-flex w-full items-center justify-center gap-2 px-5 py-3 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                "Verifying..."
              ) : (
                <>
                  Verify Email
                  <FontAwesomeIcon icon={faArrowRight} />
                </>
              )}
            </button>
          </form>

          {/* Resend */}
          <div className="mt-6 text-center">
            <p className="text-text-soft text-sm">
              Didn&apos;t receive the code?{" "}
              {countdown > 0 ? (
                <span className="text-text-soft">
                  Resend in{" "}
                  <span className="text-text font-medium">{countdown}s</span>
                </span>
              ) : (
                <button
                  onClick={handleResend}
                  disabled={resending}
                  className="text-brand font-medium transition hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {resending ? (
                    "Sending..."
                  ) : (
                    <>
                      <FontAwesomeIcon icon={faRotateRight} className="mr-1" />
                      Resend OTP
                    </>
                  )}
                </button>
              )}
            </p>
          </div>

          {/* Footer */}
          <div className="mt-4 text-center">
            <p className="text-text-soft text-sm">
              Already verified?{" "}
              <Link
                to="/login"
                className="text-brand font-medium transition hover:opacity-80"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
