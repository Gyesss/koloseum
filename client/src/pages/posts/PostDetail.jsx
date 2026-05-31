import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faHeart,
  faCalendarDays,
  faLocationDot,
  faPen,
  faTrash,
  faUser,
  faStar,
} from "@fortawesome/free-solid-svg-icons";

import { getPostById, deletePost } from "../../api/posts";
import { getPoll } from "../../api/polls";
import { getComments } from "../../api/comments";
import { likePost, unlikePost } from "../../api/post-likes";
import { getEventById } from "../../api/events";
import useAuth from "../../hooks/useAuth";

import PostMediaViewer from "./components/PostMediaViewer";
import PostPollSection from "./components/PostPollSection";
import PostComments from "./components/PostComments";

const POST_TYPE_STYLES = {
  ANNOUNCEMENT: {
    label: "Announcement",
    className: "bg-blue-500/15 text-blue-600",
  },
  PROJECT: { label: "Project", className: "bg-violet-500/15 text-violet-600" },
  REWARD: { label: "Reward", className: "bg-amber-500/15 text-amber-600" },
};

function timeAgo(dateStr) {
  const diff = (Date.now() - new Date(dateStr)) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export default function PostDetail() {
  const { eventId, postId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [post, setPost] = useState(null);
  const [event, setEvent] = useState(null);
  const [poll, setPoll] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [likeSubmitting, setLikeSubmitting] = useState(false);

  useEffect(() => {
    async function loadAll() {
      try {
        setLoading(true);

        const [postRes, commentsRes] = await Promise.all([
          getPostById(eventId, postId),
          getComments(eventId, postId),
        ]);

        const postData = postRes?.data || postRes;
        setPost({ ...postData, eventId });
        setIsLiked(postData.isLiked || false);
        setLikesCount(postData._count?.postLikes || 0);
        setComments(commentsRes?.data || commentsRes || []);

        // Fetch event detail and poll in parallel
        const [eventRes, pollRes] = await Promise.allSettled([
          getEventById(eventId),
          getPoll(eventId, postId),
        ]);

        if (eventRes.status === "fulfilled") {
          setEvent(eventRes.value?.data || eventRes.value);
        }
        if (pollRes.status === "fulfilled") {
          setPoll(pollRes.value?.data || null);
        }
      } catch (err) {
        console.error("Failed to load post:", err);
      } finally {
        setLoading(false);
      }
    }
    loadAll();
  }, [eventId, postId]);

  const handleLike = async () => {
    if (!user || likeSubmitting) return;
    const wasLiked = isLiked;
    setIsLiked(!wasLiked);
    setLikesCount((c) => (wasLiked ? c - 1 : c + 1));
    try {
      setLikeSubmitting(true);
      if (wasLiked) {
        await unlikePost(eventId, postId);
      } else {
        await likePost(eventId, postId);
      }
    } catch (err) {
      setIsLiked(wasLiked);
      setLikesCount((c) => (wasLiked ? c + 1 : c - 1));
      console.error("Like failed:", err);
    } finally {
      setLikeSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      await deletePost(eventId, postId);
      navigate(`/events/${eventId}`);
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete post.");
    }
  };

  const isOwner = post?.collaborators?.some(
    (c) => c.isOwner && c.userId === user?.id,
  );
  const canManage = user?.role === "ADMIN" || isOwner;
  const mood = event?.mood || null;
  const typeStyle = post?.postType ? POST_TYPE_STYLES[post.postType] : null;

  if (loading) {
    return (
      <div className="bg-background flex min-h-dvh items-center justify-center px-4 py-8 pb-28 sm:px-6 md:pb-8 md:pl-28 lg:px-10 lg:pl-32">
        <div className="border-brand h-10 w-10 animate-spin rounded-full border-4 border-t-transparent" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="bg-background min-h-dvh px-4 py-8 pb-28 sm:px-6 md:pb-8 md:pl-28 lg:px-10 lg:pl-32">
        <div className="mx-auto flex max-w-3xl flex-col items-center justify-center py-32 text-center">
          <h1 className="font-heading text-text text-3xl font-semibold">
            Post Not Found
          </h1>
          <p className="text-text-soft mt-3">
            This post does not exist or has been removed.
          </p>
          <button
            onClick={() => navigate(-1)}
            className="bg-brand rounded-base mt-6 px-5 py-3 text-sm font-medium text-white"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const owner = post.collaborators?.find((c) => c.isOwner)?.user;

  return (
    <div className="bg-background text-text font-body min-h-dvh px-4 py-8 pb-28 sm:px-6 md:pb-8 md:pl-28 lg:px-10 lg:pl-32">
      <div className="mx-auto max-w-3xl space-y-8">
        {/* BACK */}
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="group text-text-soft hover:text-text inline-flex cursor-pointer items-center gap-2 text-sm font-semibold transition"
        >
          <FontAwesomeIcon
            icon={faArrowLeft}
            className="transition group-hover:-translate-x-1"
          />
          <span>Back</span>
        </button>

        {/* MAIN CARD */}
        <div
          className="rounded-card overflow-hidden border shadow-xs"
          style={{ borderColor: mood ? `${mood}55` : undefined }}
        >
          {/* MOOD TOP STRIPE */}
          {mood && (
            <div className="h-1 w-full" style={{ backgroundColor: mood }} />
          )}

          {/* MEDIA */}
          {post.media?.length > 0 && <PostMediaViewer media={post.media} />}

          <div className="space-y-5 p-6">
            {/* BADGES */}
            <div className="flex flex-wrap items-center gap-2">
              {typeStyle && (
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold tracking-wider uppercase ${typeStyle.className}`}
                >
                  {typeStyle.label}
                </span>
              )}
              {post.isFeatured && (
                <span className="flex items-center gap-1 rounded-full bg-amber-500/15 px-2.5 py-0.5 text-[11px] font-bold tracking-wider text-amber-600 uppercase">
                  <FontAwesomeIcon icon={faStar} className="text-[10px]" />
                  Featured
                </span>
              )}
            </div>

            {/* TITLE */}
            <h1 className="font-heading text-text text-3xl leading-tight font-bold tracking-tight">
              {post.title}
            </h1>

            {/* META */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              {/* AUTHOR */}
              <div className="flex items-center gap-2">
                <div className="bg-border/20 h-7 w-7 overflow-hidden rounded-full">
                  {owner?.avatarUrl ? (
                    <img
                      src={owner.avatarUrl}
                      alt={owner.fullName}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="text-text-soft flex h-full w-full items-center justify-center text-xs">
                      <FontAwesomeIcon icon={faUser} />
                    </div>
                  )}
                </div>
                <span className="text-text-soft text-xs font-medium">
                  {owner?.fullName || owner?.username || "Unknown"}
                </span>
              </div>

              <span className="text-text-soft/40 text-xs">·</span>
              <span className="text-text-soft text-xs">
                {timeAgo(post.createdAt)}
              </span>

              {event && (
                <>
                  <span className="text-text-soft/40 text-xs">·</span>
                  <Link
                    to={`/events/${eventId}`}
                    className="text-text-soft hover:text-text flex items-center gap-1.5 text-xs transition"
                    style={{ color: mood || undefined }}
                  >
                    <FontAwesomeIcon
                      icon={faCalendarDays}
                      className="text-[11px]"
                    />
                    {event.name}
                  </Link>
                </>
              )}

              {event?.location && (
                <>
                  <span className="text-text-soft/40 text-xs">·</span>
                  <span className="text-text-soft flex items-center gap-1.5 text-xs">
                    <FontAwesomeIcon
                      icon={faLocationDot}
                      className="text-[11px]"
                    />
                    {event.location}
                  </span>
                </>
              )}
            </div>

            {/* CAPTION */}
            {post.caption && (
              <p className="text-text-soft text-sm leading-relaxed whitespace-pre-line">
                {post.caption}
              </p>
            )}

            {/* ACTIONS BAR */}
            <div
              className="flex items-center justify-between border-t pt-4"
              style={{ borderColor: mood ? `${mood}33` : undefined }}
            >
              <button
                onClick={handleLike}
                disabled={!user || likeSubmitting}
                className={`flex items-center gap-2 text-sm font-semibold transition ${
                  isLiked
                    ? "text-rose-500"
                    : "text-text-soft hover:text-rose-500"
                } disabled:opacity-50`}
              >
                <FontAwesomeIcon icon={faHeart} />
                <span>{likesCount}</span>
              </button>

              {canManage && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => navigate(`/posts/${eventId}/${postId}/edit`)}
                    className="border-border hover:bg-border/20 text-text-soft rounded-base flex cursor-pointer items-center gap-1.5 border px-3 py-1.5 text-xs font-bold tracking-wider uppercase transition"
                  >
                    <FontAwesomeIcon icon={faPen} />
                    Edit
                  </button>
                  <button
                    onClick={handleDelete}
                    className="flex cursor-pointer items-center gap-1.5 rounded-sm border border-rose-200 px-3 py-1.5 text-xs font-bold tracking-wider text-rose-600 uppercase transition hover:bg-rose-50"
                  >
                    <FontAwesomeIcon icon={faTrash} />
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* POLL */}
        {poll && (
          <PostPollSection
            poll={poll}
            eventId={eventId}
            postId={postId}
            user={user}
          />
        )}

        {/* COMMENTS */}
        <PostComments
          comments={comments}
          eventId={eventId}
          postId={postId}
          user={user}
        />
      </div>
    </div>
  );
}
