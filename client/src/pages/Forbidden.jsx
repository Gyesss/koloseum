import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCompass,
  faShieldHalved,
  faHouse,
  faLock,
} from "@fortawesome/free-solid-svg-icons";

export default function Forbidden() {
  return (
    <div className="bg-background flex min-h-dvh items-center justify-center px-6 py-12">
      <div className="bg-surface border-border rounded-card w-full max-w-2xl overflow-hidden border shadow-sm">
        {/* Top Accent */}
        <div className="from-border via-brand to-accent h-2 w-full bg-linear-to-r" />

        <div className="px-8 py-14 text-center sm:px-12">
          {/* Icon */}
          <div className="bg-surface border-border rounded-card mx-auto mb-6 flex h-20 w-20 items-center justify-center border">
            <FontAwesomeIcon
              icon={faShieldHalved}
              className="text-brand text-3xl"
            />
          </div>

          {/* Error Label */}
          <p className="text-brand mb-3 text-sm font-semibold tracking-[0.35em] uppercase">
            Error 403
          </p>

          {/* Heading */}
          <h1 className="font-heading text-text text-4xl font-semibold tracking-tight sm:text-5xl">
            Access Forbidden
          </h1>

          {/* Description */}
          <p className="text-text-soft font-body mx-auto mt-5 max-w-xl text-base leading-7">
            You do not have permission to access this section of Koloseum. Some
            archives and management areas are restricted to organizers and
            administrators only.
          </p>

          {/* Divider */}
          <div className="my-8 flex items-center justify-center gap-3">
            <div className="bg-border h-px w-16" />
            <div className="bg-accent flex h-8 w-8 items-center justify-center rounded-full">
              <FontAwesomeIcon
                icon={faLock}
                className="text-background text-xs"
              />
            </div>
            <div className="bg-border h-px w-16" />
          </div>

          {/* Actions */}
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              to="/"
              className="bg-brand rounded-base inline-flex items-center gap-2 px-5 py-3 text-sm font-medium text-white transition hover:opacity-90"
            >
              <FontAwesomeIcon icon={faHouse} />
              Back to Home
            </Link>

            <Link
              to="/explore"
              className="bg-background border-border text-text rounded-base hover:bg-surface inline-flex items-center gap-2 border px-5 py-3 text-sm font-medium transition"
            >
              <FontAwesomeIcon icon={faCompass} />
              Explore Events
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
