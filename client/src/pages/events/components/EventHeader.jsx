import { Link } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faCalendarDays,
  faClock,
  faEnvelope,
  faLocationDot,
  faPen,
  faPlus,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";

function formatDate(date) {
  return new Date(date).toLocaleString("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function EventHeader({ event, canManage, onDelete }) {
  return (
    <section
      className="border-border rounded-card relative overflow-hidden border"
      style={{
        backgroundColor: event.mood || "#18181b",
      }}
    >
      {/* Banner */}
      {event.bannerUrl && (
        <div
          className="absolute inset-0 bg-cover bg-center opacity-25"
          style={{
            backgroundImage: `url(${event.bannerUrl})`,
          }}
        />
      )}

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-linear-to-br from-black/70 via-black/50 to-black/80" />

      {/* Ambient Glow */}
      <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-white/5" />

      <div className="relative z-10 flex flex-col gap-8 p-6 sm:p-8">
        {/* Top */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-semibold tracking-[0.2em] text-white uppercase backdrop-blur-sm">
              <FontAwesomeIcon icon={faCalendarDays} />
              Event
            </div>

            <h1 className="font-heading text-4xl font-semibold tracking-tight text-white drop-shadow-sm sm:text-5xl">
              {event.name}
            </h1>

            {event.tagline && (
              <p className="mt-4 text-lg text-white/80 italic">
                {event.tagline}
              </p>
            )}

            {event.description && (
              <p className="mt-6 max-w-2xl leading-7 text-white/75">
                {event.description}
              </p>
            )}
          </div>

          {canManage && (
            <div className="flex flex-wrap gap-3">
              <Link
                to={`/events/${event.id}/edit`}
                className="rounded-base bg-white/12 px-4 py-3 text-sm font-medium text-white backdrop-blur-sm transition hover:bg-white/20"
              >
                <FontAwesomeIcon icon={faPen} className="mr-2" />
                Edit
              </Link>

              <Link
                to={`/posts/create?eventId=${event.id}`}
                className="rounded-base bg-white/12 px-4 py-3 text-sm font-medium text-white backdrop-blur-sm transition hover:bg-white/20"
              >
                <FontAwesomeIcon icon={faPlus} className="mr-2" />
                Create Post
              </Link>

              <Link
                to={`/events/${event.id}/invitation`}
                className="rounded-base bg-white/12 px-4 py-3 text-sm font-medium text-white backdrop-blur-sm transition hover:bg-white/20"
              >
                <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
                Invitations
              </Link>

              <button
                type="button"
                onClick={onDelete}
                className="rounded-base border border-red-400/30 bg-red-500/15 px-4 py-3 text-sm font-medium text-red-100 transition hover:bg-red-500/25"
              >
                <FontAwesomeIcon icon={faTrash} className="mr-2" />
                Delete
              </button>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="grid gap-4 md:grid-cols-3">
          <InfoCard
            icon={faLocationDot}
            label="Location"
            value={event.location || "Unknown"}
          />

          <InfoCard
            icon={faClock}
            label="Start"
            value={formatDate(event.startAt)}
          />

          <InfoCard
            icon={faClock}
            label="End"
            value={formatDate(event.endAt)}
          />
        </div>

        {/* Created By */}
        {event.users?.length > 0 && (
          <div>
            <p className="mb-3 text-sm font-semibold tracking-[0.2em] text-white/60 uppercase">
              Created By
            </p>

            <div className="flex flex-wrap gap-3">
              {event.users.map((user) => (
                <Link
                  key={user.id}
                  to={`/users/${user.id}`}
                  className="rounded-card flex items-center gap-3 border border-white/10 bg-white/10 px-4 py-3 backdrop-blur-sm transition hover:bg-white/15"
                >
                  {user.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt={user.fullName}
                      className="h-11 w-11 rounded-full object-cover"
                    />
                  ) : (
                    <div className="bg-brand flex h-11 w-11 items-center justify-center rounded-full text-sm font-semibold text-white">
                      {user.fullName?.charAt(0)}
                    </div>
                  )}

                  <div>
                    <p className="text-sm font-medium text-white">
                      {user.fullName}
                    </p>

                    <p className="text-xs text-white/60">@{user.username}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function InfoCard({ icon, label, value }) {
  return (
    <div className="rounded-card border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
      <div className="mb-2 flex items-center gap-2 text-sm font-medium text-white/70">
        <FontAwesomeIcon icon={icon} />

        <span>{label}</span>
      </div>

      <p className="text-white">{value}</p>
    </div>
  );
}
