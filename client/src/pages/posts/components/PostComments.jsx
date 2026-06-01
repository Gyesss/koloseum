import { useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart,
  faUser,
  faPaperPlane,
  faPen,
  faCheck,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import {
  createComment,
  updateComment,
  deleteComment,
} from "../../../api/comments";
import { likeComment, unlikeComment } from "../../../api/comment-likes";

const ROLE_STYLES = {
  ADMIN: "bg-rose-500/15 text-rose-600",
  ORGANIZER: "bg-violet-500/15 text-violet-600",
  MEMBER: "bg-blue-500/15 text-blue-600",
};

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
  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    try {
      setSubmitting(true);
      const res = await createComment(eventId, postId, {
        content: content.trim(),
      });
      setComments((prev) => [res?.data || res, ...prev]);
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

  const startEdit = (comment) => {
    setEditingId(comment.id);
    setEditContent(comment.content);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditContent("");
  };

  const handleEditSubmit = async (commentId) => {
    if (!editContent.trim()) return;
    try {
      const res = await updateComment(eventId, postId, commentId, {
        content: editContent.trim(),
      });
      const updated = res?.data || res;
      setComments((prev) =>
        prev.map((c) =>
          c.id === commentId ? { ...c, content: updated.content } : c,
        ),
      );
      cancelEdit();
    } catch (err) {
      console.error("Edit comment failed:", err);
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
    <div className="bg-surface border-border rounded-card overflow-hidden border shadow-sm">
      <div className="border-border border-b px-6 py-4">
        <h3 className="font-heading text-text text-xl font-bold">
          Comments{" "}
          <span className="text-text-soft text-base font-normal">
            ({comments.length})
          </span>
        </h3>
      </div>

      <div className="border-border border-b px-6 py-4">
        {user ? (
          <form onSubmit={handleSubmit} className="flex gap-3">
            <Link to={`/users/${user.id}`} className="shrink-0">
              <div className="border-brand bg-border/20 h-9 w-9 overflow-hidden rounded-full border transition hover:opacity-80">
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
            </Link>
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
      </div>

      <div className="divide-border divide-y">
        {comments.length === 0 ? (
          <div className="px-6 py-10 text-center">
            <p className="text-text-soft text-sm">
              No comments yet. Be the first!
            </p>
          </div>
        ) : (
          comments.map((comment) => {
            const canEdit = user && user.id === comment.userId;
            const canDelete =
              user && (user.id === comment.userId || user.role === "ADMIN");
            const roleStyle =
              ROLE_STYLES[comment.user?.role] || ROLE_STYLES.MEMBER;
            const isEditing = editingId === comment.id;

            return (
              <div key={comment.id} className="flex gap-3 px-6 py-4">
                <Link
                  to={`/users/${comment.user?.id}`}
                  className="shrink-0"
                  onClick={(e) => !comment.user?.id && e.preventDefault()}
                >
                  <div className="bg-border/20 border-border hover:border-brand h-9 w-9 overflow-hidden rounded-full border transition">
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
                </Link>

                <div className="min-w-0 flex-1">
                  <div className="mb-1.5 flex items-start justify-between gap-2">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/users/${comment.user?.id}`}
                          className="text-text hover:text-brand text-xs font-bold transition"
                          onClick={(e) =>
                            !comment.user?.id && e.preventDefault()
                          }
                        >
                          {comment.user?.fullName ||
                            comment.user?.username ||
                            "Unknown"}
                        </Link>
                        {comment.user?.role && (
                          <span
                            className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold tracking-wider uppercase ${roleStyle}`}
                          >
                            {comment.user.role}
                          </span>
                        )}
                      </div>
                      {comment.user?.username && (
                        <span className="text-text-soft text-[11px]">
                          @{comment.user.username}
                        </span>
                      )}
                    </div>
                    <span className="text-text-soft/50 shrink-0 text-[11px]">
                      {timeAgo(comment.createdAt)}
                    </span>
                  </div>

                  {isEditing ? (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleEditSubmit(comment.id);
                          if (e.key === "Escape") cancelEdit();
                        }}
                        className="border-border bg-background text-text focus:border-brand rounded-card flex-1 border px-3 py-1.5 text-sm font-medium transition outline-none"
                        autoFocus
                      />
                      <button
                        onClick={() => handleEditSubmit(comment.id)}
                        className="text-brand cursor-pointer p-1.5 transition hover:opacity-70"
                      >
                        <FontAwesomeIcon icon={faCheck} className="text-xs" />
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="text-text-soft hover:text-text cursor-pointer p-1.5 transition"
                      >
                        <FontAwesomeIcon icon={faXmark} className="text-xs" />
                      </button>
                    </div>
                  ) : (
                    <p className="text-text text-sm leading-relaxed wrap-break-word">
                      {comment.content}
                    </p>
                  )}

                  {!isEditing && (
                    <div className="mt-2 flex items-center gap-3">
                      <button
                        onClick={() => handleLikeComment(comment)}
                        disabled={!user}
                        className={`flex items-center gap-1.5 text-xs font-semibold transition disabled:opacity-40 ${
                          comment.isLiked
                            ? "text-rose-500"
                            : "text-text-soft hover:text-rose-500"
                        }`}
                      >
                        <FontAwesomeIcon icon={faHeart} />
                        <span>{comment._count?.commentLikes || 0}</span>
                      </button>

                      {canEdit && (
                        <button
                          onClick={() => startEdit(comment)}
                          className="text-text-soft hover:text-text flex items-center gap-1 text-xs font-semibold transition"
                        >
                          <FontAwesomeIcon
                            icon={faPen}
                            className="text-[10px]"
                          />
                          Edit
                        </button>
                      )}

                      {canDelete && (
                        <button
                          onClick={() => handleDeleteComment(comment.id)}
                          className="text-text-soft text-xs font-semibold transition hover:text-rose-600"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
