import { useEffect, useState, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarDays,
  faLocationDot,
  faCompass,
  faCompassDrafting,
  faBell,
  faUser,
  faHeart,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";

import { getEvents } from "../api/events";
import { getPosts } from "../api/posts";
import PostCard from "../components/ui/posts/PostCard";
import useAuth from "../hooks/useAuth";

const determinePriorityEvent = (eventList) => {
  if (!eventList || eventList.length === 0) return null;

  const now = new Date("2026-05-30T21:00:00Z");

  const active = eventList.find(
    (e) => new Date(e.startAt) <= now && new Date(e.endAt) >= now,
  );
  if (active) return { data: active, status: "LIVE NOW" };

  const upcoming = [...eventList]
    .filter((e) => new Date(e.startAt) > now)
    .sort((a, b) => new Date(a.startAt) - new Date(b.startAt))[0];
  if (upcoming) return { data: upcoming, status: "UPCOMING" };

  const past = [...eventList]
    .filter((e) => new Date(e.endAt) < now)
    .sort((a, b) => new Date(b.endAt) - new Date(a.endAt))[0];
  if (past) return { data: past, status: "ARCHIVED MEMORIAL" };

  return { data: eventList[0], status: "FEATURED" };
};

export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [events, setEvents] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHomeData() {
      try {
        setLoading(true);
        const eventRes = await getEvents();
        const eventList = eventRes?.data || eventRes || [];
        setEvents(eventList);

        const priorityResult = determinePriorityEvent(eventList);
        const priorityEvent = priorityResult?.data;

        if (priorityEvent?.id) {
          const postRes = await getPosts(priorityEvent.id);
          setPosts(postRes?.data || postRes || []);
        }
      } catch (err) {
        console.error("Failed to synchronize arena assets:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchHomeData();
  }, []);

  const priorityResult = useMemo(
    () => determinePriorityEvent(events),
    [events],
  );

  const likedPosts = useMemo(() => {
    return posts
      .filter((post) => post.isLiked === true)
      .map((post) => ({
        ...post,
        event: { name: priorityResult?.data?.name || "Koloseum Arena" },
      }));
  }, [posts, priorityResult]);

  const handlePostUpdate = (updatedPost) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === updatedPost.id ? updatedPost : p)),
    );
  };

  if (loading) {
    return (
      <div className="bg-background text-text-soft flex min-h-dvh items-center justify-center px-4 py-8 pb-28 sm:px-6 md:pb-8 md:pl-28 lg:px-10 lg:pl-32">
        <div className="border-brand h-10 w-10 animate-spin rounded-full border-4 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="bg-background text-text font-body min-h-dvh px-4 py-8 pb-28 sm:px-6 md:pb-8 md:pl-28 lg:px-10 lg:pl-32">
      {/* HERO HERO BRIDGING HEADER */}
      <div className="rounded-card bg-text text-surface relative overflow-hidden px-6 py-12 shadow-xl md:px-12 md:py-16">
        <div className="from-accent/10 absolute inset-0 bg-linear-to-b via-transparent to-transparent" />
        <div className="relative mx-auto max-w-7xl">
          <p className="text-accent text-xs font-bold tracking-[0.4em] uppercase">
            Welcome Back, {user?.fullName || "Grand Creator"}
          </p>
          <h1 className="font-heading text-surface mt-4 text-4xl font-bold tracking-tight md:text-6xl">
            The Digital Arena for{" "}
            <span className="text-brand">Historic Events</span>
          </h1>
          <p className="text-surface/70 mt-4 max-w-2xl text-base">
            Orchestrate schedules, participate in verified community polls, and
            access unalterable event memorial repositories.
          </p>

          {/* DYNAMIC INTEGRATED NAVIGATION MATRIX HUB */}
          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4 md:gap-4">
            <Link
              to="/explore"
              className="group rounded-card border-surface/10 bg-surface/5 hover:border-brand hover:bg-brand/10 border p-4 backdrop-blur-xs transition"
            >
              <FontAwesomeIcon
                icon={faCompass}
                className="text-brand text-lg transition group-hover:scale-110"
              />
              <h3 className="text-surface mt-3 text-sm font-semibold">
                Explore Arena
              </h3>
              <p className="text-surface/60 mt-1 text-xs">Discover showcases</p>
            </Link>

            <Link
              to="/events"
              className="group rounded-card border-surface/10 bg-surface/5 hover:border-brand hover:bg-brand/10 border p-4 backdrop-blur-xs transition"
            >
              <FontAwesomeIcon
                icon={faCalendarDays}
                className="text-brand text-lg transition group-hover:scale-110"
              />
              <h3 className="text-surface mt-3 text-sm font-semibold">
                Events Hub
              </h3>
              <p className="text-surface/60 mt-1 text-xs">Schedules & QnAs</p>
            </Link>

            <Link
              to="/notifications"
              className="group rounded-card border-surface/10 bg-surface/5 hover:border-accent hover:bg-accent/10 border p-4 backdrop-blur-xs transition"
            >
              <FontAwesomeIcon
                icon={faBell}
                className="text-accent text-lg transition group-hover:scale-110"
              />
              <h3 className="text-surface mt-3 text-sm font-semibold">
                Notifications
              </h3>
              <p className="text-surface/60 mt-1 text-xs">
                Winner reveals & news
              </p>
            </Link>

            <Link
              to="/onboarding"
              className="group rounded-card border-surface/10 bg-surface/5 hover:border-accent hover:bg-accent/10 border p-4 backdrop-blur-xs transition"
            >
              <FontAwesomeIcon
                icon={faCompassDrafting}
                className="text-surface/40 text-lg transition group-hover:scale-110"
              />
              <h3 className="text-surface mt-3 text-sm font-semibold">
                Walkthrough
              </h3>
              <p className="text-surface/40 mt-1 text-xs">
                View onboarding setup
              </p>
            </Link>
          </div>
        </div>
      </div>

      {/* CORE EXPERIENCE SECTION */}
      <div className="mx-auto mt-12 max-w-7xl">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* LEFT/CENTER 2 COLS: PRIORITIZED STAGE EVENT PANEL */}
          <div className="space-y-10 lg:col-span-2">
            <section>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-heading text-text text-3xl font-bold tracking-tight">
                  Current Arena Highlights
                </h2>
                {priorityResult && (
                  <span className="bg-brand/15 text-brand rounded-full px-3 py-1 text-xs font-bold tracking-wider uppercase">
                    {priorityResult.status}
                  </span>
                )}
              </div>

              {priorityResult?.data ? (
                <div className="border-border bg-surface rounded-card overflow-hidden border shadow-xs transition hover:shadow-md">
                  <div className="bg-border/20 relative h-64 w-full">
                    <img
                      src={priorityResult.data.bannerUrl}
                      alt={priorityResult.data.name}
                      className="h-full w-full object-cover"
                    />
                    <div className="from-text/80 via-text/20 absolute inset-0 bg-linear-to-t to-transparent" />
                    <div className="text-surface absolute right-5 bottom-5 left-5">
                      <p className="text-accent text-xs font-semibold tracking-widest uppercase">
                        {priorityResult.data.tagline || "Veni, Vidi, Vici"}
                      </p>
                      <h3 className="font-heading text-surface mt-1 text-3xl font-bold">
                        {priorityResult.data.name}
                      </h3>
                    </div>
                  </div>

                  <div className="p-6">
                    <p className="text-text-soft line-clamp-3 text-sm leading-relaxed">
                      {priorityResult.data.description}
                    </p>

                    <div className="border-border/40 text-text-soft mt-6 flex flex-wrap items-center gap-6 border-t pt-4 text-xs">
                      <div className="flex items-center gap-2">
                        <FontAwesomeIcon
                          icon={faLocationDot}
                          className="text-brand"
                        />
                        <span>{priorityResult.data.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FontAwesomeIcon
                          icon={faCalendarDays}
                          className="text-accent"
                        />
                        <span>
                          {new Date(
                            priorityResult.data.startAt,
                          ).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                    </div>

                    <div className="mt-6">
                      <button
                        onClick={() =>
                          navigate(`/events/${priorityResult.data.id}`)
                        }
                        className="rounded-base bg-brand text-surface cursor-pointer px-5 py-3 text-xs font-bold tracking-wider uppercase transition hover:opacity-90"
                      >
                        Enter Event Arena{" "}
                        <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="border-border/60 bg-surface rounded-card flex flex-col items-center justify-center border border-dashed p-12 text-center">
                  <FontAwesomeIcon
                    icon={faCalendarDays}
                    className="text-text-soft text-4xl opacity-40"
                  />
                  <p className="text-text-soft mt-4 text-sm font-medium">
                    No strategic events active inside the coloseum grid.
                  </p>
                </div>
              )}
            </section>

            {/* CURATED POSTS SECTION FROM PREVIOUS EVENT (MASONRY EFFECT) */}
            <section>
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="font-heading text-text text-3xl font-bold tracking-tight">
                    Your Liked Moments
                  </h2>
                  <p className="text-text-soft mt-0.5 text-xs">
                    Verified records bookmarked by your digital signature
                  </p>
                </div>
                <FontAwesomeIcon icon={faHeart} className="text-brand" />
              </div>

              {likedPosts.length > 0 ? (
                /* IMPLEMENTASI MASONRY EFFECT: Menggunakan CSS Columns & gap */
                <div className="columns-1 gap-6 space-y-6 sm:columns-2">
                  {likedPosts.map((post) => (
                    /* break-inside-avoid mencegah kartu terpotong di tengah kolom */
                    <div key={post.id} className="break-inside-avoid">
                      <PostCard
                        post={post}
                        poll={post.poll}
                        onPostUpdate={handlePostUpdate}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="border-border bg-surface rounded-card flex flex-col items-center justify-center border p-12 text-center">
                  <div className="bg-brand/10 text-brand mb-3 rounded-full p-4">
                    <FontAwesomeIcon icon={faHeart} />
                  </div>
                  <p className="text-text-soft text-sm font-medium">
                    No saved high-fidelity moments found.
                  </p>
                  <p className="text-text-soft/60 mt-1 max-w-xs text-xs">
                    Interact with posts in live event showcases to anchor
                    metrics here.
                  </p>
                </div>
              )}
            </section>
          </div>

          {/* RIGHT 1 COL: DYNAMIC PROFILE SIDEBAR PANELS */}
          <div className="space-y-6">
            <div className="border-border bg-surface rounded-card border p-6 shadow-xs">
              <div className="flex items-center gap-4">
                <div className="border-brand bg-border/20 relative h-12 w-12 overflow-hidden rounded-full border-2">
                  {user?.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt={user.fullName}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="text-text-soft flex h-full w-full items-center justify-center">
                      <FontAwesomeIcon icon={faUser} />
                    </div>
                  )}
                </div>
                <div>
                  <h4 className="font-heading text-text text-xl leading-tight font-bold">
                    {user?.fullName || "Anonymous Gladiator"}
                  </h4>
                  <p className="text-text-soft text-xs">
                    @{user?.username || "guest_account"}
                  </p>
                </div>
              </div>

              <div className="border-border/40 mt-6 space-y-3 border-t pt-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-text-soft">System Privileges:</span>
                  <span className="bg-brand rounded-base text-surface scale-90 px-2 py-0.5 font-bold tracking-wider uppercase">
                    {user?.role || "GUEST"}
                  </span>
                </div>
              </div>

              <button
                onClick={() => navigate("/profile")}
                className="rounded-base border-border hover:bg-border/10 text-text mt-6 w-full cursor-pointer border bg-transparent py-2.5 text-center text-xs font-semibold tracking-wider transition"
              >
                Manage Profile Ledger
              </button>
            </div>

            {/* PLATFORM PHILOSOPHY BANNER */}
            <div className="rounded-card bg-text text-surface relative overflow-hidden p-6 shadow-xl">
              <div className="bg-brand/10 absolute top-0 right-0 h-16 w-16 rounded-full blur-xl" />
              <div className="bg-brand mb-4 h-px w-8" />
              <h4 className="font-heading text-brand text-xl font-bold">
                The Koloseum Doctrine
              </h4>
              <p className="font-body text-surface/75 mt-2 text-xs leading-relaxed">
                A closed-loop secure communication matrix. Post assets can only
                be committed by verified Organizers and Administrators ensuring
                supreme focus, historical integrity, and an architecture entire
                free from digital noise.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
