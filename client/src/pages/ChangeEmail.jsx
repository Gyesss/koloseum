import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faEnvelope,
  faLock,
  faFloppyDisk,
  faEye,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";

import useAuth from "../../hooks/useAuth";
import { changeEmail } from "../../api/auth";

export default function ChangeEmail() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [form, setForm] = useState({ newEmail: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await changeEmail(form);

      // Email changed — isVerified set to false, must re-verify
      // Log user out and redirect to verify-email with new email
      logout();
      navigate("/verify-email", {
        state: { email: result.data.newEmail },
      });
    } catch (err) {
      console.error(err);
      setError(
        err?.response?.data?.message ||
          "Failed to change email. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background min-h-dvh px-6 py-10 md:px-10">
      <div className="mx-auto flex w-full max-w-xl flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-brand mb-3 inline-flex items-center gap-2 text-sm font-semibold tracking-[0.3em] uppercase">
              <FontAwesomeIcon icon={faEnvelope} />
              <span>Security</span>
            </div>

            <h1 className="font-heading text-text text-4xl font-semibold tracking-tight">
              Change Email
            </h1>

            <p className="text-text-soft mt-4 text-sm leading-7">
              Your current email is{" "}
              <span className="text-text font-medium">{user?.email}</span>.
              After changing, you will need to verify your new email address.
            </p>
          </div>

          <Link
            to="/profile"
            className="bg-surface border-border text-text rounded-base hover:bg-brand/5 inline-flex items-center justify-center gap-2 self-start border px-5 py-3 text-sm font-medium transition sm:self-auto"
          >
            <FontAwesomeIcon icon={faArrowLeft} />
            Back
          </Link>
        </div>

        <div className="bg-surface border-border rounded-card overflow-hidden border shadow-sm">
          <div className="from-border via-brand to-accent h-2 w-full bg-linear-to-r" />

          <div className="p-6 md:p-8">
            {error && (
              <div className="bg-background border-border text-text rounded-base mb-6 border px-4 py-3 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {/* New Email */}
              <div className="flex flex-col gap-2">
                <label className="text-text text-sm font-medium">
                  New Email Address
                </label>
                <div className="relative">
                  <FontAwesomeIcon
                    icon={faEnvelope}
                    className="text-text-soft absolute top-1/2 left-4 -translate-y-1/2 text-sm"
                  />
                  <input
                    type="email"
                    name="newEmail"
                    value={form.newEmail}
                    onChange={handleChange}
                    placeholder="new@example.com"
                    required
                    className="bg-background border-border text-text focus:border-brand rounded-base w-full border py-3 pr-4 pl-11 text-sm transition-colors outline-none"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="flex flex-col gap-2">
                <label className="text-text text-sm font-medium">
                  Confirm with Password
                </label>
                <div className="relative">
                  <FontAwesomeIcon
                    icon={faLock}
                    className="text-text-soft absolute top-1/2 left-4 -translate-y-1/2 text-sm"
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
                    className="bg-background border-border text-text focus:border-brand rounded-base w-full border py-3 pr-11 pl-11 text-sm transition-colors outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    className="text-text-soft hover:text-text absolute top-1/2 right-4 -translate-y-1/2 transition"
                  >
                    <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                  </button>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-brand rounded-base inline-flex items-center gap-2 px-5 py-3 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <FontAwesomeIcon icon={faFloppyDisk} />
                  {loading ? "Saving..." : "Change Email"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
