import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrashCan,
  faLock,
  faEye,
  faEyeSlash,
  faTriangleExclamation,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";

import useAuth from "../../hooks/useAuth";
import { deleteAccount } from "../../api/auth";

const CONFIRMATION_PHRASE =
  "I understand that deleting my account is permanent and all my content, posts, comments, votes, and collaborations will be erased forever with no way to recover them.";

export default function DeleteAccount({ onClose }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const isPrivileged = ["ADMIN", "ORGANIZER"].includes(user?.role);

  const [form, setForm] = useState({
    password: "",
    adminPassword: "",
    confirmPhrase: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const phraseMatches = form.confirmPhrase.trim() === CONFIRMATION_PHRASE;

  const canSubmit =
    form.password.length >= 6 &&
    phraseMatches &&
    (!isPrivileged || form.adminPassword.length > 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;

    setError("");
    setLoading(true);

    try {
      await deleteAccount({
        password: form.password,
        ...(isPrivileged && { adminPassword: form.adminPassword }),
      });

      logout();
      navigate("/", { replace: true });
    } catch (err) {
      console.error(err);
      setError(
        err?.response?.data?.message ||
          "Failed to delete account. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/60 px-4 py-8 backdrop-blur-sm sm:items-center sm:py-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-surface border-border rounded-card w-full max-w-lg overflow-hidden border shadow-xl">
        {/* Top accent — red for danger */}
        <div className="h-2 w-full bg-red-500" />

        <div className="p-6 md:p-8">
          {/* Heading */}
          <div className="mb-6 flex items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-500/10 text-red-500">
                <FontAwesomeIcon icon={faTriangleExclamation} />
              </div>
              <div>
                <h2 className="font-heading text-text text-2xl font-semibold tracking-tight">
                  Delete Account
                </h2>
                <p className="text-text-soft mt-1 text-sm leading-6">
                  This action is{" "}
                  <strong className="text-red-500">permanent</strong> and cannot
                  be undone. All your posts, comments, votes, media, and
                  collaborations will be erased forever.
                </p>
              </div>
            </div>

            {/* Close button */}
            <button
              type="button"
              onClick={onClose}
              className="text-text-soft hover:text-text mt-1 shrink-0 transition"
            >
              <FontAwesomeIcon icon={faXmark} />
            </button>
          </div>

          {error && (
            <div className="mb-5 rounded-lg border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-500">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Confirmation phrase */}
            <div className="flex flex-col gap-2">
              <label className="text-text text-sm font-medium">
                Type the following phrase exactly to confirm:
              </label>
              <p className="bg-background border-border rounded-base border px-4 py-3 text-xs leading-6 text-red-500 select-none">
                {CONFIRMATION_PHRASE}
              </p>
              <textarea
                name="confirmPhrase"
                rows={3}
                value={form.confirmPhrase}
                onChange={handleChange}
                placeholder="Type the phrase above..."
                className={`bg-background rounded-base resize-none border px-4 py-3 text-sm transition-colors outline-none ${
                  form.confirmPhrase.length > 0
                    ? phraseMatches
                      ? "border-green-500 text-green-600"
                      : "text-text border-red-400"
                    : "border-border text-text"
                }`}
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-2">
              <label className="text-text text-sm font-medium">
                Your Password
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

            {/* Admin password — only for ADMIN or ORGANIZER */}
            {isPrivileged && (
              <div className="flex flex-col gap-2">
                <label className="text-text text-sm font-medium">
                  Admin Deletion Password{" "}
                  <span className="text-text-soft font-normal">
                    (required for {user.role})
                  </span>
                </label>
                <div className="relative">
                  <FontAwesomeIcon
                    icon={faLock}
                    className="text-text-soft absolute top-1/2 left-4 -translate-y-1/2 text-sm"
                  />
                  <input
                    type={showAdminPassword ? "text" : "password"}
                    name="adminPassword"
                    value={form.adminPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
                    className="bg-background border-border text-text focus:border-brand rounded-base w-full border py-3 pr-11 pl-11 text-sm transition-colors outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowAdminPassword((p) => !p)}
                    className="text-text-soft hover:text-text absolute top-1/2 right-4 -translate-y-1/2 transition"
                  >
                    <FontAwesomeIcon
                      icon={showAdminPassword ? faEyeSlash : faEye}
                    />
                  </button>
                </div>
                <p className="text-text-soft text-xs">
                  Contact the technical team to obtain this password.
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={onClose}
                className="border-border text-text rounded-base border px-5 py-3 text-sm font-medium transition hover:bg-white/5"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={!canSubmit || loading}
                className="rounded-base inline-flex items-center justify-center gap-2 bg-red-500 px-5 py-3 text-sm font-medium text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <FontAwesomeIcon icon={faTrashCan} />
                {loading ? "Deleting..." : "Delete My Account"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
