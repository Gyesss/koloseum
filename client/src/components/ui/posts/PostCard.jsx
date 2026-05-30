import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faComment,
  faHeart,
  faShareNodes,
} from "@fortawesome/free-solid-svg-icons";
import clsx from "clsx";
import PostFilmFrame from "./PostFilmFrame";
import PostMediaGrid from "./PostMediaGrid";
import PostMeta from "./PostMeta";
import PostPollTeaser from "./PostPollTeaser";
import { likePost, unlikePost } from "../../../api/post-likes";
import useAuth from "../../../hooks/useAuth";
export default function PostCard({
  post,
  poll,
  className,
  onShare,
  onPostUpdate,
}) {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [isLiked, setIsLiked] = useState(post?.isLiked || false);
  const [likesCount, setLikesCount] = useState(post?._count?.postLikes || 0);

  const commentsCount = post?._count?.comments || 0;
  const activePoll =
    poll || post?.poll || (post?.postType === "POLL" ? post : null);
  const handleNavigate = () => {
    navigate(`/posts/${post.id}`);
  };

  const handleComments = (e) => {
    e.stopPropagation();
    navigate(`/posts/${post.id}/comments`);
  };

  const handleLike = async (e) => {
    e.stopPropagation();

    if (!user) return;

    const prevLiked = isLiked;
    const prevCount = likesCount;

    setIsLiked(!prevLiked);
    setLikesCount(prevLiked ? prevCount - 1 : prevCount + 1);

    try {
      let updated;

      if (prevLiked) {
        updated = await unlikePost(post.eventId, post.id);
      } else {
        updated = await likePost(post.eventId, post.id);
      }

      onPostUpdate?.(updated.data || updated);
    } catch (err) {
      setIsLiked(prevLiked);
      setLikesCount(prevCount);
      console.error(err);
    }
  };

  const handleShare = async (e) => {
    e.stopPropagation();

    if (onShare) {
      await onShare(post);
      return;
    }

    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.caption,
          url: window.location.origin + `/posts/${post.id}`,
        });
      } catch (error) {
        console.warn("Share cancelled:", error);
      }
    } else {
      await navigator.clipboard.writeText(
        window.location.origin + `/posts/${post.id}`,
      );
    }
  };

  return (
    <PostFilmFrame
      postType={post.postType}
      featured={post.isFeatured}
      className={className}
      to={`/posts/${post.id}`}
    >
      <div onClick={handleNavigate}>
        <PostMediaGrid media={post.media} />

        <div className="px-1 pt-6 pb-2">
          <PostMeta post={post} />
          <PostPollTeaser poll={activePoll} />
          <div className="mt-5 flex items-center justify-between border-t border-black/10 pt-4">
            <div className="flex items-center gap-5">
              <button
                type="button"
                onClick={handleLike}
                className={clsx(
                  "flex items-center gap-2 text-sm transition-colors",
                  isLiked
                    ? "text-rose-600"
                    : "text-stone-600 hover:text-stone-900",
                )}
              >
                <FontAwesomeIcon
                  icon={faHeart}
                  className={clsx(isLiked && "text-rose-600")}
                />
                <span>{likesCount}</span>
              </button>

              <button
                type="button"
                onClick={handleComments}
                className="flex items-center gap-2 text-sm text-stone-600 transition-colors hover:text-stone-900"
              >
                <FontAwesomeIcon icon={faComment} />
                <span>{commentsCount}</span>
              </button>
            </div>

            <button
              type="button"
              onClick={handleShare}
              className="flex items-center gap-2 text-sm text-stone-600 transition-colors hover:text-stone-900"
            >
              <FontAwesomeIcon icon={faShareNodes} />
              <span>Share</span>
            </button>
          </div>
        </div>
      </div>
    </PostFilmFrame>
  );
}
