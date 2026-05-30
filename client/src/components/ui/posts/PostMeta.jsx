import clsx from "clsx";
import PostBadge from "./PostBadge";
import { formatCompactDate } from "./postUtils";

export default function PostMeta({ post }) {
  const hasMedia = post?.media?.length > 0;
  const postOwner =
    post?.author || post?.collaborators?.find((c) => c.isOwner === true)?.user;
  const username = postOwner?.username || "unknown";

  return (
    <div className="font-body space-y-3">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-text-soft text-[10px] font-medium tracking-[0.28em] uppercase">
            {post?.event?.name || "Koloseum Arena"}
          </p>
        </div>

        {post?.postType && (
          <PostBadge type={post.postType}>{post.postType}</PostBadge>
        )}
      </div>

      <div className="space-y-1">
        <p className="text-text-soft text-xs">
          @{username} · {formatCompactDate(post?.createdAt)}
        </p>

        {/* TITLE (SEPARATE LIMIT) */}
        <p
          className={clsx(
            "text-text font-heading text-[1.02rem] leading-snug font-semibold",
            hasMedia ? "line-clamp-1" : "line-clamp-2",
          )}
        >
          {post?.title}
        </p>

        {/* CAPTION (SEPARATE LIMIT) */}
        {post?.caption && (
          <p
            className={clsx(
              "text-text-soft text-sm leading-relaxed",
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
