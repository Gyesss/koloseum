import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart,
  faUser,
  faPaperPlane,
} from "@fortawesome/free-solid-svg-icons";
import { createComment, deleteComment } from "../../../api/comments";
import { likeComment, unlikeComment } from "../../../api/comment-likes";

function timeAgo(dateStr) {
  const diff = (Date.now() - new Date(dateStr)) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export default function PostComments({
  comments: initial,
  eventId,
  postId,
  user,
}) {
  const [comments, setComments] = useState(initial || []);
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    try {
      setSubmitting(true);
      const res = await createComment(eventId, postId, {
        content: content.trim(),
      });
      const newComment = res?.data || res;
      setComments((prev) => [newComment, ...prev]);
      setContent("");
    } catch (err) {
      console.error("Comment failed:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleLikeComment = async (comment) => {
    if (!user) return;
    const wasLiked = comment.isLiked;
    // Optimistic update
    setComments((prev) =>
      prev.map((c) =>
        c.id === comment.id
          ? {
              ...c,
              isLiked: !wasLiked,
              _count: {
                ...c._count,
                commentLikes: wasLiked
                  ? (c._count?.commentLikes || 1) - 1
                  : (c._count?.commentLikes || 0) + 1,
              },
            }
          : c,
      ),
    );
    try {
      if (wasLiked) {
        await unlikeComment(eventId, postId, comment.id);
      } else {
        await likeComment(eventId, postId, comment.id);
      }
    } catch (err) {
      // Revert on failure
      setComments((prev) =>
        prev.map((c) =>
          c.id === comment.id
            ? {
                ...c,
                isLiked: wasLiked,
                _count: {
                  ...c._count,
                  commentLikes: wasLiked
                    ? (c._count?.commentLikes || 0) + 1
                    : (c._count?.commentLikes || 1) - 1,
                },
              }
            : c,
        ),
      );
      console.error("Comment like failed:", err);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Delete this comment?")) return;
    try {
      await deleteComment(eventId, postId, commentId);
      setComments((prev) => prev.filter((c) => c.id !== commentId));
    } catch (err) {
      console.error("Delete comment failed:", err);
    }
  };

  return (
    <div className="space-y-5">
      <h3 className="font-heading text-text text-xl font-bold">
        Comments{" "}
        <span className="text-text-soft text-base font-normal">
          ({comments.length})
        </span>
      </h3>

      {/* COMMENT INPUT */}
      {user ? (
        <form onSubmit={handleSubmit} className="flex gap-3">
          <div className="border-brand bg-border/20 h-8 w-8 shrink-0 overflow-hidden rounded-full border">
            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.fullName}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="text-text-soft flex h-full w-full items-center justify-center text-xs">
                <FontAwesomeIcon icon={faUser} />
              </div>
            )}
          </div>
          <div className="flex flex-1 gap-2">
            <input
              type="text"
              placeholder="Write a comment..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="border-border bg-background text-text placeholder:text-text-soft/50 focus:border-brand rounded-card flex-1 border px-4 py-2.5 text-sm font-medium transition outline-none"
            />
            <button
              type="submit"
              disabled={submitting || !content.trim()}
              className="bg-brand rounded-card cursor-pointer px-4 py-2.5 text-white transition hover:opacity-90 disabled:opacity-50"
            >
              <FontAwesomeIcon icon={faPaperPlane} className="text-sm" />
            </button>
          </div>
        </form>
      ) : (
        <p className="text-text-soft border-border rounded-card border px-4 py-3 text-sm">
          Login to leave a comment.
        </p>
      )}

      {/* COMMENT LIST */}
      {comments.length === 0 ? (
        <p className="text-text-soft text-sm">No comments yet. Be the first!</p>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => {
            const canDelete =
              user && (user.id === comment.userId || user.role === "ADMIN");

            return (
              <div key={comment.id} className="flex gap-3">
                <div className="bg-border/20 h-8 w-8 shrink-0 overflow-hidden rounded-full">
                  {comment.user?.avatarUrl ? (
                    <img
                      src={comment.user.avatarUrl}
                      alt={comment.user.fullName}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="text-text-soft flex h-full w-full items-center justify-center text-xs">
                      <FontAwesomeIcon icon={faUser} />
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <div className="bg-background rounded-card px-4 py-3">
                    <div className="mb-1 flex items-center justify-between gap-2">
                      <span className="text-text text-xs font-bold">
                        {comment.user?.fullName || comment.user?.username}
                      </span>
                      <span className="text-text-soft text-[11px]">
                        {timeAgo(comment.createdAt)}
                      </span>
                    </div>
                    <p className="text-text text-sm leading-relaxed">
                      {comment.content}
                    </p>
                  </div>

                  <div className="mt-1.5 flex items-center gap-3 px-1">
                    <button
                      onClick={() => handleLikeComment(comment)}
                      className={`flex items-center gap-1.5 text-xs font-semibold transition ${
                        comment.isLiked
                          ? "text-rose-500"
                          : "text-text-soft hover:text-rose-500"
                      }`}
                    >
                      <FontAwesomeIcon icon={faHeart} />
                      <span>{comment._count?.commentLikes || 0}</span>
                    </button>

                    {canDelete && (
                      <button
                        onClick={() => handleDeleteComment(comment.id)}
                        className="text-text-soft text-xs font-semibold transition hover:text-rose-600"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
