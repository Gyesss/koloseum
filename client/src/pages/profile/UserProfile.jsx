import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCakeCandles,
  faShieldHalved,
  faUser,
} from "@fortawesome/free-solid-svg-icons";

import { getProfileById } from "../../api/profile";

export default function UserProfile() {
  const { userId } = useParams();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getProfileById(userId);

        setProfile(response.data);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  if (loading) {
    return (
      <div className="bg-background flex min-h-dvh items-center justify-center px-6 py-20">
        <div className="bg-surface border-border rounded-card w-full max-w-5xl overflow-hidden border shadow-sm">
          <div className="from-border via-brand to-accent h-2 w-full bg-linear-to-r" />

          <div className="animate-pulse space-y-6 p-8">
            <div className="bg-border h-64 w-full rounded-2xl" />

            <div className="-mt-20 flex items-end gap-5">
              <div className="bg-border h-32 w-32 rounded-full border-4 border-white" />

              <div className="space-y-3">
                <div className="bg-border h-7 w-56 rounded-full" />
                <div className="bg-border h-4 w-32 rounded-full" />
              </div>
            </div>

            <div className="space-y-3">
              <div className="bg-border h-4 w-full rounded-full" />
              <div className="bg-border h-4 w-4/5 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="bg-background flex min-h-dvh items-center justify-center px-6 py-20">
        <div className="bg-surface border-border rounded-card w-full max-w-lg overflow-hidden border shadow-sm">
          <div className="from-border via-brand to-accent h-2 w-full bg-linear-to-r" />

          <div className="p-10 text-center">
            <div className="bg-brand/10 text-brand mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full">
              <FontAwesomeIcon icon={faUser} className="text-2xl" />
            </div>

            <h1 className="font-heading text-text text-3xl font-semibold">
              User Not Found
            </h1>

            <p className="text-text-soft font-body mt-3 leading-7">
              The profile you are looking for may not exist or is no longer
              available.
            </p>

            <Link
              to="/explore"
              className="bg-brand rounded-base mt-8 inline-flex items-center gap-2 px-5 py-3 text-sm font-medium text-white transition hover:opacity-90"
            >
              Back to Explore
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const initials =
    profile.fullName
      ?.split(" ")
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "US";

  const formattedBirthday = profile.birthDay
    ? new Date(profile.birthDay).toLocaleDateString("en-US", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <div className="bg-background min-h-dvh px-6 py-20">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <div className="bg-surface border-border rounded-card overflow-hidden border shadow-sm">
          {/* Top Accent */}
          <div className="from-border via-brand to-accent h-2 w-full bg-linear-to-r" />

          {/* Banner */}
          <div className="relative">
            <div className="bg-surface h-64 w-full overflow-hidden">
              {profile.bannerUrl ? (
                <img
                  src={profile.bannerUrl}
                  alt={profile.fullName}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="from-brand/20 via-accent/10 to-border/30 h-full w-full bg-linear-to-br" />
              )}
            </div>

            {/* Avatar */}
            <div className="absolute -bottom-16 left-8">
              <div className="bg-surface border-background flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border-4 shadow-lg">
                {profile.avatarUrl ? (
                  <img
                    src={profile.avatarUrl}
                    alt={profile.fullName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="bg-brand flex h-full w-full items-center justify-center text-3xl font-semibold text-white">
                    {initials}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="px-8 pt-24 pb-8">
            <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
              {/* Left */}
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="font-heading text-text text-4xl font-semibold tracking-tight">
                    {profile.fullName}
                  </h1>

                  <span className="bg-brand/10 text-brand rounded-full px-3 py-1 text-xs font-semibold tracking-wide uppercase">
                    {profile.role}
                  </span>
                </div>

                <p className="text-text-soft mt-2 text-sm">
                  @{profile.username}
                </p>

                {profile.bio && (
                  <p className="text-text font-body mt-6 max-w-3xl leading-8">
                    {profile.bio}
                  </p>
                )}
              </div>

              {/* Right Info */}
              <div className="grid gap-3 sm:grid-cols-2 md:min-w-70 md:grid-cols-1">
                {profile.gender && (
                  <div className="bg-background border-border rounded-base flex items-center gap-3 border px-4 py-3">
                    <div className="bg-brand/10 text-brand flex h-10 w-10 items-center justify-center rounded-full">
                      <FontAwesomeIcon icon={faUser} />
                    </div>

                    <div>
                      <p className="text-text-soft text-xs uppercase">Gender</p>

                      <p className="text-text text-sm font-medium">
                        {profile.gender}
                      </p>
                    </div>
                  </div>
                )}

                {formattedBirthday && (
                  <div className="bg-background border-border rounded-base flex items-center gap-3 border px-4 py-3">
                    <div className="bg-brand/10 text-brand flex h-10 w-10 items-center justify-center rounded-full">
                      <FontAwesomeIcon icon={faCakeCandles} />
                    </div>

                    <div>
                      <p className="text-text-soft text-xs uppercase">
                        Birthday
                      </p>

                      <p className="text-text text-sm font-medium">
                        {formattedBirthday}
                      </p>
                    </div>
                  </div>
                )}

                <div className="bg-background border-border rounded-base flex items-center gap-3 border px-4 py-3">
                  <div className="bg-brand/10 text-brand flex h-10 w-10 items-center justify-center rounded-full">
                    <FontAwesomeIcon icon={faShieldHalved} />
                  </div>

                  <div>
                    <p className="text-text-soft text-xs uppercase">Role</p>

                    <p className="text-text text-sm font-medium">
                      {profile.role}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="border-border mt-8 border-t pt-6">
              <Link
                to="/profile"
                className="bg-brand rounded-base inline-flex items-center gap-2 px-5 py-3 text-sm font-medium text-white transition hover:opacity-90"
              >
                View My Profile
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
