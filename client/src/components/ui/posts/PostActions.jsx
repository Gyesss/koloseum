import {
  faComment,
  faHeart,
  faShareNodes,
} from "@fortawesome/free-solid-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import clsx from "clsx";

import { DEFAULT_POST_THEME, POST_THEMES } from "./postThemes";

export default function PostActions({
  postType = "ANNOUNCEMENT",

  likesCount = 0,
  commentsCount = 0,

  liked = false,

  onLike,
  onComment,
  onShare,
}) {
  const theme = POST_THEMES[postType] || DEFAULT_POST_THEME;

  return (
    <div className="mt-5 flex items-center justify-between border-t border-black/10 pt-4">
      <div className="flex items-center gap-5">
        {/* LIKE */}
        <button
          type="button"
          onClick={onLike}
          className={clsx(
            "flex items-center gap-2 text-sm transition-all duration-200 hover:opacity-70",

            liked
              ? clsx("scale-[1.03] font-medium", theme.likeActive)
              : "text-stone-700",
          )}
        >
          <FontAwesomeIcon
            icon={faHeart}
            className={clsx(
              "transition-transform duration-200",

              liked && "scale-110",
            )}
          />

          <span>{likesCount}</span>
        </button>

        {/* COMMENT */}
        <button
          type="button"
          onClick={onComment}
          className="flex items-center gap-2 text-sm text-stone-700 transition-opacity hover:opacity-70"
        >
          <FontAwesomeIcon icon={faComment} />

          <span>{commentsCount}</span>
        </button>

        {/* SHARE */}
        <button
          type="button"
          onClick={onShare}
          className="text-stone-700 transition-opacity hover:opacity-70"
        >
          <FontAwesomeIcon icon={faShareNodes} />
        </button>
      </div>
    </div>
  );
}
