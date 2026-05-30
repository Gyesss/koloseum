import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import clsx from "clsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCompass,
  faMagnifyingGlass,
  faPlus,
  faStar,
} from "@fortawesome/free-solid-svg-icons";

import { getEvents } from "../api/events";
import { getPosts } from "../api/posts";
import PostCard from "../components/ui/posts/PostCard";

export default function Explore() {
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState("");
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadInitialData() {
      try {
        setLoading(true);
        const eventsResponse = await getEvents();

        if (!mounted) return;

        const availableEvents = (eventsResponse.data || []).filter(
          (event) => new Date(event.startAt) <= new Date(),
        );

        setEvents(availableEvents);

        const now = new Date();
        const activeEvent =
          availableEvents.find(
            (event) =>
              now >= new Date(event.startAt) && now <= new Date(event.endAt),
          ) || availableEvents[0];

        if (!activeEvent) {
          setPosts([]);
          return;
        }

        setSelectedEventId(activeEvent.id);
        const postsResponse = await getPosts(activeEvent.id);

        if (!mounted) return;
        setPosts(postsResponse.data || []);
      } catch (error) {
        console.error("Failed to load explore data:", error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadInitialData();

    return () => {
      mounted = false;
    };
  }, []);

  async function handleEventChange(eventId) {
    try {
      setSelectedEventId(eventId);
      setLoading(true);
      const response = await getPosts(eventId);
      setPosts(response.data || []);
    } catch (error) {
      console.error("Failed to load posts:", error);
    } finally {
      setLoading(false);
    }
  }

  const handlePostUpdate = (updatedPost) => {
    if (!updatedPost?.id) return;

    setPosts((prev) =>
      prev.map((post) =>
        post.id === updatedPost.id
          ? {
              ...post,
              ...updatedPost,
            }
          : post,
      ),
    );
  };

  const filteredPosts = useMemo(() => {
    const keyword = search.toLowerCase().trim();
    const currentEventObj = events.find((e) => e.id === selectedEventId);
    const currentEventName = currentEventObj
      ? currentEventObj.name
      : "Koloseum Arena";

    return posts
      .filter((post) => !post.isDraft)
      .map((post) => ({
        ...post,
        event: { name: currentEventName },
      }))
      .filter((post) => {
        if (!keyword) return true;

        return (
          post.title?.toLowerCase().includes(keyword) ||
          post.caption?.toLowerCase().includes(keyword) ||
          post.event?.name?.toLowerCase().includes(keyword)
        );
      })
      .sort((a, b) => {
        if (a.isFeatured && !b.isFeatured) return -1;
        if (!a.isFeatured && b.isFeatured) return 1;

        return new Date(b.createdAt) - new Date(a.createdAt);
      });
  }, [posts, search, events, selectedEventId]);

  return (
    <div className="bg-background font-body text-text min-h-dvh px-4 py-8 pb-28 sm:px-6 md:pb-8 md:pl-28 lg:px-10 lg:pl-32">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        {/* HEADER */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-brand mb-3 inline-flex items-center gap-2 text-sm font-semibold tracking-[0.3em] uppercase">
              <FontAwesomeIcon icon={faCompass} />
              <span>Explore</span>
            </div>

            <h1 className="font-heading text-text text-4xl font-semibold tracking-tight sm:text-5xl">
              Discover Creative Posts
            </h1>

            <p className="text-text-soft mt-4 max-w-2xl text-base leading-7">
              Browse featured announcements, rewards, and projects from active
              Koloseum events.
            </p>
          </div>

          <Link
            to="/posts/create"
            className="bg-brand rounded-base inline-flex items-center justify-center gap-2 self-start px-5 py-3 text-sm font-medium text-white shadow-xs transition hover:opacity-95 sm:self-auto"
          >
            <FontAwesomeIcon icon={faPlus} />
            Create Post
          </Link>
        </div>

        {/* CONTROLS */}
        <div className="flex w-full flex-col gap-3 xl:max-w-md">
          {/* SEARCH */}
          <div className="border-border bg-surface rounded-card flex items-center gap-3 border px-4 py-3 shadow-xs">
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              className="text-text-soft"
            />
            <input
              type="text"
              placeholder="Search posts, captions, or events..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="text-text placeholder:text-text-soft w-full bg-transparent text-sm font-medium outline-none"
            />
          </div>

          {/* EVENT SELECT */}
          <select
            value={selectedEventId}
            onChange={(event) => handleEventChange(event.target.value)}
            className="border-border bg-surface text-text rounded-card cursor-pointer border px-4 py-3 text-sm font-medium shadow-xs outline-none"
          >
            {events.map((event) => (
              <option key={event.id} value={event.id}>
                {event.name}
              </option>
            ))}
          </select>
        </div>

        {/* FEATURED WARNING BADGE */}
        {!loading && filteredPosts.some((post) => post.isFeatured) && (
          <div className="border-border bg-surface rounded-card flex items-center gap-3 border px-5 py-4 shadow-xs">
            <div className="bg-brand/10 text-brand flex h-11 w-11 shrink-0 items-center justify-center rounded-full">
              <FontAwesomeIcon icon={faStar} />
            </div>

            <div>
              <p className="text-text text-sm font-semibold">
                Featured posts are prioritized
              </p>
              <p className="text-text-soft text-sm">
                Highlighted content appears first in the feed.
              </p>
            </div>
          </div>
        )}

        {/* CONTENT MASONRY GRID */}
        {loading ? (
          <div
            className={clsx(
              "gap-4 [column-fill:balance]",
              "columns-1 sm:columns-2 md:columns-2 lg:columns-3 xl:columns-4 2xl:columns-5",
            )}
          >
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="border-border bg-surface rounded-card mb-4 break-inside-avoid border p-4 shadow-xs"
              >
                <div className="bg-border rounded-base aspect-4/5 animate-pulse" />
                <div className="mt-4 space-y-2">
                  <div className="bg-border/60 h-3 w-20 animate-pulse rounded-full" />
                  <div className="bg-border/60 h-4 w-4/5 animate-pulse rounded-full" />
                  <div className="bg-border/60 h-3 w-2/3 animate-pulse rounded-full" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredPosts.length > 0 ? (
          <div
            className={clsx(
              "gap-4 [column-fill:balance]",
              "columns-1 sm:columns-2 md:columns-2 lg:columns-3 xl:columns-4 2xl:columns-5",
            )}
          >
            {filteredPosts.map((post) => (
              <div key={post.id} className="mb-4 break-inside-avoid">
                <PostCard post={post} compact onPostUpdate={handlePostUpdate} />
              </div>
            ))}
          </div>
        ) : (
          <div className="border-border bg-surface rounded-card flex flex-col items-center justify-center border px-6 py-24 text-center shadow-xs">
            <h2 className="font-heading text-text text-3xl font-semibold">
              No Posts Found
            </h2>
            <p className="text-text-soft mt-3 max-w-md leading-7">
              There are currently no posts matching your search or selected
              event inside this archive ledger.
            </p>
            <Link
              to="/events"
              className="bg-brand rounded-base mt-6 px-5 py-3 text-sm font-medium text-white shadow-xs transition hover:opacity-90"
            >
              Browse Events
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
