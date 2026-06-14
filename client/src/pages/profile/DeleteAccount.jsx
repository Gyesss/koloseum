import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrashCan,
  faLock,
  faEye,
  faEyeSlash,
  faTriangleExclamation,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";

import useAuth from "../../hooks/useAuth";
import { deleteAccount } from "../../api/auth";

const CONFIRMATION_PHRASE =
  "I understand that deleting my account is permanent and all my content, posts, comments, votes, and collaborations will be erased forever with no way to recover them.";

export default function DeleteAccount() {
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
    <div className="bg-background min-h-dvh px-6 py-10 md:px-10">
      <div className="mx-auto flex w-full max-w-xl flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 text-sm font-semibold tracking-[0.3em] text-red-500 uppercase">
              <FontAwesomeIcon icon={faTriangleExclamation} />
              <span>Danger Zone</span>
            </div>

            <h1 className="font-heading text-text text-4xl font-semibold tracking-tight">
              Delete Account
            </h1>

            <p className="text-text-soft mt-4 text-sm leading-7">
              This action is{" "}
              <span className="font-semibold text-red-500">permanent</span> and
              cannot be undone. All your posts, comments, votes, media, and
              collaborations will be erased forever.
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

        {/* Card */}
        <div className="overflow-hidden rounded-2xl border border-red-500/20 shadow-sm">
          <div className="h-2 w-full bg-red-500" />

          <div className="bg-surface p-6 md:p-8">
            {error && (
              <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-500">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              {/* Confirmation phrase */}
              <div className="flex flex-col gap-2">
                <label className="text-text text-sm font-medium">
                  Type the following phrase exactly to confirm:
                </label>

                <div className="bg-background border-border rounded-base border px-4 py-3 text-xs leading-6 text-red-500 select-none">
                  {CONFIRMATION_PHRASE}
                </div>

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

                {form.confirmPhrase.length > 0 && !phraseMatches && (
                  <p className="text-xs text-red-400">
                    Phrase does not match. Please type it exactly as shown.
                  </p>
                )}

                {phraseMatches && (
                  <p className="text-xs text-green-600">✓ Phrase confirmed.</p>
                )}
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
                    className="bg-background border-border text-text rounded-base w-full border py-3 pr-11 pl-11 text-sm transition-colors outline-none focus:border-red-400"
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

              {/* Admin password */}
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
                      className="bg-background border-border text-text rounded-base w-full border py-3 pr-11 pl-11 text-sm transition-colors outline-none focus:border-red-400"
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
                <Link
                  to="/profile"
                  className="border-border text-text rounded-base inline-flex items-center justify-center border px-5 py-3 text-sm font-medium transition hover:bg-white/5"
                >
                  Cancel
                </Link>

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
    </div>
  );
}
