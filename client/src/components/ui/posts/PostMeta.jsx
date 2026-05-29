import clsx from "clsx";
import PostBadge from "./PostBadge";
import { formatCompactDate } from "./postUtils";

export default function PostMeta({ post }) {
  const hasMedia = post?.media?.length > 0;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[10px] tracking-[0.28em] text-stone-500 uppercase">
            {post?.event?.name || "Unknown Event"}
          </p>
        </div>

        {post?.postType && (
          <PostBadge type={post.postType}>{post.postType}</PostBadge>
        )}
      </div>

      <div className="space-y-1">
        <p className="text-sm text-stone-500">
          @{post?.author?.username || "unknown"} ·{" "}
          {formatCompactDate(post?.createdAt)}
        </p>

        {/* TITLE (SEPARATE LIMIT) */}
        <p
          className={clsx(
            "text-[1.02rem] leading-snug font-semibold text-stone-800",
            hasMedia ? "line-clamp-1" : "line-clamp-2",
          )}
        >
          {post?.title}
        </p>

        {/* CAPTION (SEPARATE LIMIT) */}
        {post?.caption && (
          <p
            className={clsx(
              "text-[1.02rem] leading-snug text-stone-700",
              hasMedia ? "line-clamp-1" : "line-clamp-3",
            )}
          >
            {post.caption}
          </p>
        )}
      </div>
    </div>
  );
}
