import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faBolt,
  faCalendarDays,
  faCheck,
  faClock,
  faHourglassHalf,
  faLocationDot,
  faPen,
  faPlus,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";

import useAuth from "../../hooks/useAuth";

import { deleteEvent as apiDeleteEvent, getEvents } from "../../api/events";

import formatDate from "../../utils/formatDate";
import getCountdown from "../../utils/getCountdown";
import getDaysAgo from "../../utils/getDaysAgo";

export default function EventsIndex() {
  const { user } = useAuth();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        setLoading(true);

        const response = await getEvents();

        setEvents(response.data || []);
      } catch (error) {
        console.error("Failed to fetch events:", error);
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

  async function handleDelete(eventId) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this event?",
    );

    if (!confirmed) return;

    try {
      setDeletingId(eventId);

      await apiDeleteEvent(eventId);

      setEvents((prev) => prev.filter((event) => event.id !== eventId));
    } catch (error) {
      console.error("Delete event failed:", error);

      alert("Failed to delete event");
    } finally {
      setDeletingId(null);
    }
  }

  const categorizedEvents = useMemo(() => {
    const now = new Date();

    return {
      live: events.filter(
        (event) =>
          now >= new Date(event.startAt) && now <= new Date(event.endAt),
      ),

      upcoming: events.filter((event) => now < new Date(event.startAt)),

      finished: events.filter((event) => now > new Date(event.endAt)),
    };
  }, [events]);

  const canManage = user?.role === "ADMIN" || user?.role === "ORGANIZER";

  return (
    <div className="bg-background min-h-dvh px-4 py-8 pb-28 sm:px-6 md:pb-8 md:pl-28 lg:px-10 lg:pl-32">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-10">
        {/* HEADER */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-brand mb-3 inline-flex items-center gap-2 text-sm font-semibold tracking-[0.3em] uppercase">
              <FontAwesomeIcon icon={faCalendarDays} />
              <span>Events</span>
            </div>

            <h1 className="font-heading text-text text-4xl font-semibold tracking-tight sm:text-5xl">
              Discover Events
            </h1>

            <p className="text-text-soft mt-4 max-w-2xl text-base leading-7">
              Explore ongoing, upcoming, and archived experiences across the
              Koloseum network.
            </p>
          </div>

          {canManage && (
            <Link
              to="/events/create"
              className="bg-brand rounded-base inline-flex items-center justify-center gap-2 self-start px-5 py-3 text-sm font-medium text-white transition hover:opacity-90 sm:self-auto"
            >
              <FontAwesomeIcon icon={faPlus} />
              Create Event
            </Link>
          )}
        </div>

        {/* LIVE */}
        <EventSection
          title="Happening Right Now"
          icon={faBolt}
          description="Events currently taking place."
          emptyMessage="No live events right now."
        >
          {categorizedEvents.live.map((event) => (
            <LiveEventCard
              key={event.id}
              event={event}
              canManage={canManage}
              deletingId={deletingId}
              onDelete={handleDelete}
            />
          ))}
        </EventSection>

        {/* UPCOMING */}
        <EventSection
          title="Upcoming Events"
          icon={faHourglassHalf}
          description="Prepare yourself for upcoming moments."
          emptyMessage="No upcoming events."
        >
          <div className="grid gap-5 lg:grid-cols-2">
            {categorizedEvents.upcoming.map((event) => (
              <UpcomingEventCard
                key={event.id}
                event={event}
                canManage={canManage}
                deletingId={deletingId}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </EventSection>

        {/* FINISHED */}
        <EventSection
          title="Past Events"
          icon={faCheck}
          description="Events that already concluded."
          emptyMessage="No finished events."
        >
          <div className="grid gap-5 lg:grid-cols-2">
            {categorizedEvents.finished.map((event) => (
              <FinishedEventCard
                key={event.id}
                event={event}
                canManage={canManage}
                deletingId={deletingId}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </EventSection>

        {!loading && events.length === 0 && (
          <div className="bg-surface border-border rounded-card flex flex-col items-center justify-center border px-8 py-20 text-center">
            <FontAwesomeIcon
              icon={faCalendarDays}
              className="text-brand mb-5 text-4xl"
            />

            <h2 className="font-heading text-text text-2xl font-semibold">
              No Events Yet
            </h2>

            <p className="text-text-soft mt-3 max-w-md leading-7">
              There are currently no events available in the archive.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function EventSection({ title, icon, description, emptyMessage, children }) {
  const hasContent = Array.isArray(children) ? children.length > 0 : !!children;

  return (
    <section className="flex flex-col gap-5">
      <div className="flex items-center gap-3">
        <div className="bg-surface border-border rounded-base flex h-11 w-11 items-center justify-center border">
          <FontAwesomeIcon icon={icon} className="text-brand" />
        </div>

        <div>
          <h2 className="font-heading text-text text-2xl font-semibold">
            {title}
          </h2>

          <p className="text-text-soft text-sm">{description}</p>
        </div>
      </div>

      {hasContent ? (
        children
      ) : (
        <div className="bg-surface border-border rounded-card border px-6 py-10 text-center">
          <p className="text-text-soft">{emptyMessage}</p>
        </div>
      )}
    </section>
  );
}

function LiveEventCard({ event, canManage, deletingId, onDelete }) {
  return (
    <div
      className="border-border rounded-card relative overflow-hidden border"
      style={{
        backgroundColor: event.mood,
      }}
    >
      {event.bannerUrl && (
        <div
          className="absolute inset-0 bg-cover bg-center opacity-25"
          style={{
            backgroundImage: `url(${event.bannerUrl})`,
          }}
        />
      )}

      <div className="absolute inset-0 bg-linear-to-br from-black/55 via-black/40 to-black/70" />

      <div className="relative z-10 flex flex-col gap-8 p-7">
        <div className="flex flex-wrap items-start justify-between gap-5">
          <div className="max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/12 px-4 py-2 text-xs font-semibold tracking-[0.2em] text-white uppercase backdrop-blur-sm">
              <FontAwesomeIcon icon={faBolt} />
              Happening Right Now
            </div>

            <h2 className="font-heading text-4xl font-semibold tracking-tight text-white">
              {event.name}
            </h2>

            <p className="mt-3 text-lg text-white/80">{event.tagline}</p>
          </div>

          {canManage && (
            <EventActions
              eventId={event.id}
              deleting={deletingId === event.id}
              onDelete={onDelete}
            />
          )}
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          <InfoBox
            icon={faLocationDot}
            label="Location"
            value={event.location}
          />

          <InfoBox
            icon={faCalendarDays}
            label="Started"
            value={formatDate(event.startAt)}
          />

          <InfoBox
            icon={faClock}
            label="Ends"
            value={formatDate(event.endAt)}
          />
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            to={`/events/${event.id}`}
            className="rounded-base bg-white px-5 py-3 text-sm font-medium text-black transition hover:opacity-90"
          >
            View Details
          </Link>

          <div className="rounded-base border border-white/20 bg-white/10 px-5 py-3 text-sm text-white backdrop-blur-sm">
            Live experience in progress
          </div>
        </div>
      </div>
    </div>
  );
}

function UpcomingEventCard({ event, canManage, deletingId, onDelete }) {
  const countdown = getCountdown(event.startAt);

  return (
    <div
      className="border-border rounded-card relative overflow-hidden border"
      style={{
        backgroundColor: event.mood,
      }}
    >
      {event.bannerUrl && (
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{
            backgroundImage: `url(${event.bannerUrl})`,
          }}
        />
      )}

      <div className="absolute inset-0 bg-linear-to-br from-black/45 via-black/30 to-black/60" />

      <div className="relative z-10 flex flex-col gap-6 p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="mb-2 text-xs font-semibold tracking-[0.25em] text-white/70 uppercase">
              Upcoming
            </p>

            <h3 className="font-heading text-3xl font-semibold text-white">
              {event.name}
            </h3>

            <p className="mt-2 text-white/80">{event.tagline}</p>
          </div>

          {canManage && (
            <EventActions
              eventId={event.id}
              deleting={deletingId === event.id}
              onDelete={onDelete}
            />
          )}
        </div>

        <div className="rounded-card border border-white/15 bg-white/10 px-5 py-4 backdrop-blur-sm">
          <p className="text-xs font-semibold tracking-[0.2em] text-white/60 uppercase">
            Countdown
          </p>

          <div className="mt-2 text-3xl font-semibold text-white">
            {countdown}
          </div>
        </div>

        <Link
          to={`/events/${event.id}`}
          className="rounded-base bg-white/12 px-4 py-3 text-center text-sm font-medium text-white backdrop-blur-sm transition hover:bg-white/18"
        >
          View Event
        </Link>
      </div>
    </div>
  );
}

function FinishedEventCard({ event, canManage, deletingId, onDelete }) {
  return (
    <div
      className="border-border rounded-card relative overflow-hidden border grayscale-[0.15]"
      style={{
        backgroundColor: event.mood,
      }}
    >
      {event.bannerUrl && (
        <div
          className="absolute inset-0 bg-cover bg-center opacity-15"
          style={{
            backgroundImage: `url(${event.bannerUrl})`,
          }}
        />
      )}

      <div className="absolute inset-0 bg-black/70" />

      <div className="relative z-10 flex flex-col gap-6 p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="mb-2 text-xs font-semibold tracking-[0.25em] text-white/60 uppercase">
              Finished
            </p>

            <h3 className="font-heading text-3xl font-semibold text-white">
              {event.name}
            </h3>

            <p className="mt-2 text-white/70">{event.tagline}</p>
          </div>

          {canManage && (
            <EventActions
              eventId={event.id}
              deleting={deletingId === event.id}
              onDelete={onDelete}
            />
          )}
        </div>

        <div className="rounded-card border border-white/10 bg-white/5 px-5 py-4 backdrop-blur-sm">
          <p className="text-xs font-semibold tracking-[0.2em] text-white/60 uppercase">
            Ended
          </p>

          <div className="mt-2 text-2xl font-semibold text-white">
            {getDaysAgo(event.endAt)}
          </div>
        </div>

        <Link
          to={`/events/${event.id}`}
          className="rounded-base bg-white/10 px-4 py-3 text-center text-sm font-medium text-white transition hover:bg-white/15"
        >
          View Archive
        </Link>
      </div>
    </div>
  );
}

function EventActions({ eventId, deleting, onDelete }) {
  return (
    <div className="flex items-center gap-2">
      <Link
        to={`/events/${eventId}/edit`}
        className="rounded-base flex h-10 w-10 items-center justify-center bg-white/12 text-white backdrop-blur-sm transition hover:bg-white/20"
      >
        <FontAwesomeIcon icon={faPen} />
      </Link>

      <button
        type="button"
        onClick={() => onDelete(eventId)}
        disabled={deleting}
        className="rounded-base flex h-10 w-10 items-center justify-center bg-red-500/80 text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <FontAwesomeIcon icon={faTrash} />
      </button>
    </div>
  );
}

function InfoBox({ icon, label, value }) {
  return (
    <div className="rounded-card border border-white/12 bg-white/10 p-4 backdrop-blur-sm">
      <div className="mb-2 flex items-center gap-2 text-sm text-white/70">
        <FontAwesomeIcon icon={icon} />
        <span>{label}</span>
      </div>

      <p className="font-medium text-white">{value}</p>
    </div>
  );
}
