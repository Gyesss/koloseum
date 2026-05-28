import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPen,
  faEnvelope,
  faPhone,
  faLocationDot,
  faCakeCandles,
  faShieldHalved,
  faUser,
} from "@fortawesome/free-solid-svg-icons";

import useAuth from "../../hooks/useAuth";

export default function ProfileIndex() {
  const { user } = useAuth();

  if (!user) return null;

  const initials = user.fullName
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const formattedBirthDay = user.birthDay
    ? new Date(user.birthDay).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <div className="bg-background min-h-dvh px-6 py-10 md:px-10">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        {/* Banner */}
        <div className="bg-surface border-border rounded-card overflow-hidden border shadow-sm">
          <div className="from-border via-brand to-accent h-2 w-full bg-linear-to-r" />

          <div className="relative h-52 w-full md:h-72">
            {user.bannerUrl ? (
              <img
                src={user.bannerUrl}
                alt={user.fullName}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="bg-surface h-full w-full" />
            )}

            {/* Avatar */}
            <div className="absolute bottom-0 left-6 translate-y-1/2">
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.fullName}
                  className="border-background h-28 w-28 rounded-full border-4 object-cover shadow-sm md:h-32 md:w-32"
                />
              ) : (
                <div className="bg-brand border-background flex h-28 w-28 items-center justify-center rounded-full border-4 text-3xl font-semibold text-white shadow-sm md:h-32 md:w-32">
                  {initials}
                </div>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="px-6 pt-20 pb-8 md:px-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
              {/* Left */}
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="font-heading text-text text-4xl font-semibold">
                    {user.fullName}
                  </h1>

                  <span className="bg-brand/10 text-brand rounded-full px-3 py-1 text-xs font-semibold tracking-wide uppercase">
                    {user.role}
                  </span>
                </div>

                <p className="text-text-soft mt-2 text-sm">@{user.username}</p>

                {user.bio && (
                  <p className="text-text mt-5 max-w-2xl leading-7">
                    {user.bio}
                  </p>
                )}
              </div>

              {/* Edit */}
              <Link
                to="/profile/edit"
                className="bg-brand rounded-base inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-medium text-white transition hover:opacity-90"
              >
                <FontAwesomeIcon icon={faPen} />
                Edit Profile
              </Link>
            </div>

            {/* Info Grid */}
            <div className="mt-10 grid gap-4 md:grid-cols-2">
              <ProfileCard icon={faEnvelope} label="Email" value={user.email} />

              <ProfileCard
                icon={faPhone}
                label="Phone"
                value={user.phone || "Not provided"}
              />

              <ProfileCard
                icon={faLocationDot}
                label="Address"
                value={user.address || "Not provided"}
              />

              <ProfileCard
                icon={faCakeCandles}
                label="Birth Day"
                value={formattedBirthDay || "Not provided"}
              />

              <ProfileCard
                icon={faUser}
                label="Gender"
                value={user.gender || "Not provided"}
              />

              <ProfileCard
                icon={faShieldHalved}
                label="Role"
                value={user.role}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProfileCard({ icon, label, value }) {
  return (
    <div className="bg-surface border-border rounded-card flex items-start gap-4 border p-5">
      <div className="bg-brand/10 text-brand flex h-11 w-11 shrink-0 items-center justify-center rounded-full">
        <FontAwesomeIcon icon={icon} />
      </div>

      <div className="min-w-0">
        <p className="text-text-soft text-xs font-semibold tracking-wide uppercase">
          {label}
        </p>

        <p className="text-text wrap-break-words mt-1 text-sm leading-6">
          {value}
        </p>
      </div>
    </div>
  );
}
