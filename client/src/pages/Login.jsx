import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faEnvelope,
  faLock,
} from "@fortawesome/free-solid-svg-icons";

import useAuth from "../hooks/useAuth";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      await login(form);

      navigate("/");
    } catch (err) {
      console.error(err);

      setError(err?.response?.data?.message || "Invalid email or password.");
    } finally {
      setLoading(false);
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
              Welcome Back
            </h1>

            <p className="text-text-soft font-body mt-4 text-sm leading-7">
              Sign in to continue exploring events, collaborations, and your
              personalized experience.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-background border-border text-text rounded-base mb-6 border px-4 py-3 text-sm">
              {typeof error === "string" ? error : "Something went wrong."}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="text-text mb-2 block text-sm font-medium">
                Email
              </label>

              <div className="relative">
                <FontAwesomeIcon
                  icon={faEnvelope}
                  className="text-text-soft absolute top-1/2 left-4 -translate-y-1/2 text-sm"
                />

                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="marcus@example.com"
                  required
                  className="bg-background border-border text-text focus:border-brand rounded-base w-full border py-3 pr-4 pl-11 text-sm transition-colors outline-none"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-text mb-2 block text-sm font-medium">
                Password
              </label>

              <div className="relative">
                <FontAwesomeIcon
                  icon={faLock}
                  className="text-text-soft absolute top-1/2 left-4 -translate-y-1/2 text-sm"
                />

                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  className="bg-background border-border text-text focus:border-brand rounded-base w-full border py-3 pr-4 pl-11 text-sm transition-colors outline-none"
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="bg-brand rounded-base inline-flex w-full items-center justify-center gap-2 px-5 py-3 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                "Signing In..."
              ) : (
                <>
                  Sign In
                  <FontAwesomeIcon icon={faArrowRight} />
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-text-soft text-sm">
              Don&apos;t have an account?{" "}
              <Link
                to="/register"
                className="text-brand font-medium transition hover:opacity-80"
              >
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
