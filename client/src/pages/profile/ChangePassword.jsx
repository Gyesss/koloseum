import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faLock,
  faFloppyDisk,
  faEye,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";

import { changePassword } from "../../api/auth";

function PasswordInput({ label, name, value, onChange }) {
  const [show, setShow] = useState(false);

  return (
    <div className="flex flex-col gap-2">
      <label className="text-text text-sm font-medium">{label}</label>
      <div className="relative">
        <FontAwesomeIcon
          icon={faLock}
          className="text-text-soft absolute top-1/2 left-4 -translate-y-1/2 text-sm"
        />
        <input
          type={show ? "text" : "password"}
          name={name}
          value={value}
          onChange={onChange}
          required
          className="bg-background border-border text-text focus:border-brand rounded-base w-full border py-3 pr-11 pl-11 text-sm transition-colors outline-none"
        />
        <button
          type="button"
          onClick={() => setShow((p) => !p)}
          className="text-text-soft hover:text-text absolute top-1/2 right-4 -translate-y-1/2 transition"
        >
          <FontAwesomeIcon icon={show ? faEyeSlash : faEye} />
        </button>
      </div>
    </div>
  );
}

function getStrength(password) {
  if (!password) return null;

  let score = 0;
  const checks = {
    length: password.length >= 8,
    longLength: password.length >= 12,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    symbol: /[^A-Za-z0-9]/.test(password),
  };

  if (checks.length) score++;
  if (checks.longLength) score++;
  if (checks.uppercase) score++;
  if (checks.lowercase) score++;
  if (checks.number) score++;
  if (checks.symbol) score++;

  if (score <= 2)
    return { label: "Weak", color: "#ef4444", width: "25%", checks };
  if (score <= 3)
    return { label: "Fair", color: "#f97316", width: "50%", checks };
  if (score <= 4)
    return { label: "Good", color: "#eab308", width: "75%", checks };
  return { label: "Strong", color: "#22c55e", width: "100%", checks };
}

function PasswordStrength({ password }) {
  const strength = useMemo(() => getStrength(password), [password]);

  if (!strength) return null;

  const criteria = [
    { label: "At least 8 characters", met: strength.checks.length },
    { label: "At least 12 characters", met: strength.checks.longLength },
    { label: "Uppercase letter", met: strength.checks.uppercase },
    { label: "Lowercase letter", met: strength.checks.lowercase },
    { label: "Number", met: strength.checks.number },
    { label: "Symbol (!@#$...)", met: strength.checks.symbol },
  ];

  return (
    <div className="flex flex-col gap-3">
      {/* Bar */}
      <div className="flex items-center gap-3">
        <div className="bg-border h-1.5 flex-1 overflow-hidden rounded-full">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: strength.width, background: strength.color }}
          />
        </div>
        <span
          className="text-xs font-semibold"
          style={{ color: strength.color }}
        >
          {strength.label}
        </span>
      </div>

      {/* Criteria checklist */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-1">
        {criteria.map((c) => (
          <p
            key={c.label}
            className="text-xs transition-colors"
            style={{ color: c.met ? "#22c55e" : "#78716c" }}
          >
            {c.met ? "✓" : "○"} {c.label}
          </p>
        ))}
      </div>
    </div>
  );
}

export default function ChangePassword() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.newPassword !== form.confirmPassword) {
      setError("New passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      await changePassword({
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });

      navigate("/profile");
    } catch (err) {
      console.error(err);
      setError(
        err?.response?.data?.message ||
          "Failed to change password. Please try again.",
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
              <FontAwesomeIcon icon={faLock} />
              <span>Security</span>
            </div>

            <h1 className="font-heading text-text text-4xl font-semibold tracking-tight">
              Change Password
            </h1>

            <p className="text-text-soft mt-4 text-sm leading-7">
              Enter your current password and choose a new one.
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
              <PasswordInput
                label="Current Password"
                name="currentPassword"
                value={form.currentPassword}
                onChange={handleChange}
              />

              <div className="flex flex-col gap-3">
                <PasswordInput
                  label="New Password"
                  name="newPassword"
                  value={form.newPassword}
                  onChange={handleChange}
                />
                <PasswordStrength password={form.newPassword} />
              </div>

              <PasswordInput
                label="Confirm New Password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
              />

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-brand rounded-base inline-flex items-center gap-2 px-5 py-3 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <FontAwesomeIcon icon={faFloppyDisk} />
                  {loading ? "Saving..." : "Save Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
