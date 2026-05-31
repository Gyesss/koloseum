import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import clsx from "clsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faList,
  faHeart,
  faComment,
  faFolderOpen,
} from "@fortawesome/free-solid-svg-icons";

import useAuth from "../../hooks/useAuth";
import { getEvents } from "../../api/events";
import { getPosts } from "../../api/posts";
import PostCard from "../../components/ui/posts/PostCard";

export default function PostsIndex() {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState("");
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const eventsRes = await getEvents();
        const allEvents = eventsRes.data || [];
        setEvents(allEvents);

        if (allEvents.length > 0) {
          const defaultEventId = allEvents[0].id;
          setSelectedEventId(defaultEventId);
          const postsRes = await getPosts(defaultEventId);
          setPosts(postsRes.data || []);
        }
      } catch (error) {
        console.error("Failed to load posts index:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleEventChange = async (eventId) => {
    setSelectedEventId(eventId);
    setLoading(true);
    try {
      const res = await getPosts(eventId);
      setPosts(res.data || []);
    } finally {
      setLoading(false);
    }
  };

  const categorizedPosts = useMemo(() => {
    if (!user) return { others: posts };

    const created = posts.filter((p) =>
      p.collaborators?.some((c) => c.userId === user.id && c.isOwner),
    );
    const liked = posts.filter((p) => p.isLiked);
    const commented = posts.filter((p) => p._count?.comments > 0);
    const others = posts.filter(
      (p) =>
        !p.collaborators?.some((c) => c.userId === user.id && c.isOwner) &&
        !p.isLiked &&
        !(p._count?.comments > 0),
    );

    return { created, liked, commented, others };
  }, [posts, user]);

  const canCreate = user?.role === "ADMIN" || user?.role === "ORGANIZER";

  return (
    <div className="bg-background font-body text-text min-h-dvh px-4 py-8 pb-28 sm:px-6 md:pb-8 md:pl-28 lg:px-10 lg:pl-32">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        {/* HEADER */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-brand mb-3 inline-flex items-center gap-2 text-sm font-semibold tracking-[0.3em] uppercase">
              <FontAwesomeIcon icon={faList} />
              <span>Posts Archive</span>
            </div>
            <h1 className="font-heading text-text text-4xl font-semibold tracking-tight sm:text-5xl">
              Post Management
            </h1>
            <p className="text-text-soft mt-4 max-w-2xl text-base leading-7">
              A comprehensive repository of creative posts and updates from
              across all active Koloseum events.
            </p>
          </div>
          {canCreate && (
            <Link
              to="/posts/create"
              className="bg-brand rounded-base inline-flex items-center justify-center gap-2 self-start px-5 py-3 text-sm font-medium text-white shadow-xs transition hover:opacity-95 sm:self-auto"
            >
              <FontAwesomeIcon icon={faPlus} />
              Create Post
            </Link>
          )}
        </div>

        {/* CONTROLS */}
        <div className="xl:max-w-md">
          <select
            value={selectedEventId}
            onChange={(e) => handleEventChange(e.target.value)}
            className="border-border bg-surface text-text rounded-card w-full cursor-pointer border px-4 py-3 text-sm font-medium shadow-xs outline-none"
          >
            {events.map((e) => (
              <option key={e.id} value={e.id}>
                {e.name}
              </option>
            ))}
          </select>
        </div>

        {/* SECTIONS */}
        {loading ? (
          <p className="text-text-soft">Loading posts...</p>
        ) : (
          [
            { title: "My Posts", data: categorizedPosts.created, icon: faPlus },
            {
              title: "Liked by Me",
              data: categorizedPosts.liked,
              icon: faHeart,
            },
            {
              title: "Commented by Me",
              data: categorizedPosts.commented,
              icon: faComment,
            },
            {
              title: "General Feed",
              data: categorizedPosts.others,
              icon: faFolderOpen,
            },
          ].map(
            (section, idx) =>
              section.data.length > 0 && (
                <section key={idx} className="flex flex-col gap-5">
                  <h2 className="text-text font-heading flex items-center gap-3 text-2xl font-semibold">
                    <FontAwesomeIcon
                      icon={section.icon}
                      className="text-brand"
                    />
                    {section.title}
                  </h2>
                  <div
                    className={clsx(
                      "gap-4 [column-fill:balance]",
                      "columns-1 sm:columns-2 lg:columns-3 xl:columns-4",
                    )}
                  >
                    {section.data.map((post) => (
                      <div key={post.id} className="mb-4 break-inside-avoid">
                        <PostCard post={post} />
                      </div>
                    ))}
                  </div>
                </section>
              ),
          )
        )}
      </div>
    </div>
  );
}
