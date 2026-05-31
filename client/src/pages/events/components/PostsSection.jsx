import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import clsx from "clsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faPlus,
  faStar,
} from "@fortawesome/free-solid-svg-icons";
import PostCard from "../../../components/ui/posts/PostCard";

export default function PostsSection({ posts, canManage, eventId }) {
  const [search, setSearch] = useState("");

  const filteredPosts = useMemo(() => {
    const keyword = search.toLowerCase().trim();

    return posts
      .filter((post) => !post.isDraft)
      .filter((post) => {
        if (!keyword) return true;
        return (
          post.title?.toLowerCase().includes(keyword) ||
          post.caption?.toLowerCase().includes(keyword)
        );
      })
      .sort((a, b) => {
        if (a.isFeatured && !b.isFeatured) return -1;
        if (!a.isFeatured && b.isFeatured) return 1;
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
  }, [posts, search]);

  return (
    <div className="flex flex-col gap-6">
      {/* CONTROLS */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="border-border bg-surface rounded-card flex items-center gap-3 border px-4 py-3 shadow-xs xl:w-full xl:max-w-md">
          <FontAwesomeIcon
            icon={faMagnifyingGlass}
            className="text-text-soft"
          />
          <input
            type="text"
            placeholder="Search posts or captions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="text-text placeholder:text-text-soft w-full bg-transparent text-sm font-medium outline-none"
          />
        </div>

        {canManage && (
          <Link
            to={`/posts/create?eventId=${eventId}`}
            className="bg-brand rounded-base inline-flex items-center justify-center gap-2 self-start px-5 py-3 text-sm font-medium text-white shadow-xs transition hover:opacity-95 sm:self-auto"
          >
            <FontAwesomeIcon icon={faPlus} />
            Create Post
          </Link>
        )}
      </div>

      {/* FEATURED BADGE */}
      {filteredPosts.some((post) => post.isFeatured) && (
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

      {/* MASONRY GRID */}
      {filteredPosts.length > 0 ? (
        <div
          className={clsx(
            "gap-4 [column-fill:balance]",
            "columns-1 sm:columns-2 lg:columns-3 xl:columns-4",
          )}
        >
          {filteredPosts.map((post) => (
            <div key={post.id} className="mb-4 break-inside-avoid">
              <PostCard post={post} compact onPostUpdate={() => {}} />
            </div>
          ))}
        </div>
      ) : (
        <div className="border-border bg-surface rounded-card flex flex-col items-center justify-center border px-6 py-24 text-center shadow-xs">
          <h2 className="font-heading text-text text-3xl font-semibold">
            No Posts Found
          </h2>
          <p className="text-text-soft mt-3 max-w-md leading-7">
            {search
              ? "No posts match your search in this event."
              : "There are no published posts in this event yet."}
          </p>
          {canManage && (
            <Link
              to={`/posts/create?eventId=${eventId}`}
              className="bg-brand rounded-base mt-6 px-5 py-3 text-sm font-medium text-white shadow-xs transition hover:opacity-90"
            >
              Create First Post
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
