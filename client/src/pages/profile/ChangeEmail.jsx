import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";

import useAuth from "../../hooks/useAuth";

export default function ChangeEmail() {
  const { user } = useAuth();

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
            <div className="flex flex-col items-center gap-6 py-4 text-center">
              <div className="bg-brand/10 text-brand flex h-16 w-16 items-center justify-center rounded-full text-2xl">
                <FontAwesomeIcon icon={faEnvelope} />
              </div>

              <div>
                <h2 className="font-heading text-text text-xl font-semibold">
                  Feature Unavailable
                </h2>
                <p className="text-text-soft mt-3 text-sm leading-7">
                  Email change is currently unavailable through the platform.
                  Please contact our technical team via WhatsApp to request an
                  email change manually.
                </p>
              </div>

              <a
                href="https://wa.me/6282336924926"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-brand rounded-base inline-flex items-center gap-2 px-5 py-3 text-sm font-medium text-white transition hover:opacity-90"
              >
                <FontAwesomeIcon icon={faWhatsapp} />
                Contact via WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
