import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faCloudArrowUp,
  faPlus,
  faTrash,
  faSquarePollHorizontal,
  faFloppyDisk,
  faPaperPlane,
} from "@fortawesome/free-solid-svg-icons";

import { getEvents } from "../../api/events";
import { getPosts, createPost, updatePost, deletePost } from "../../api/posts";
import { createMediaPost } from "../../api/media";
import { createPoll, getPoll, deletePoll } from "../../api/polls";
import useAuth from "../../hooks/useAuth";

export default function CreatePost() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState("");
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [postType, setPostType] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);

  const [enablePoll, setEnablePoll] = useState(false);
  const [pollQuestion, setPollQuestion] = useState("");
  const [pollMaxChoices, setPollMaxChoices] = useState(1);
  const [pollOptions, setPollOptions] = useState(["", ""]);

  const [mediaFiles, setMediaFiles] = useState([]);
  const [existingMedia, setExistingMedia] = useState([]);

  const [activeDraftId, setActiveDraftId] = useState(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  useEffect(() => {
    async function syncAndLoadData() {
      try {
        setInitialLoading(true);

        const eventsResponse = await getEvents();
        const availableEvents = eventsResponse.data || [];
        setEvents(availableEvents);

        if (availableEvents.length === 0) return;

        let foundDraft = null;
        let eventWithDraftId = "";

        for (const ev of availableEvents) {
          const postsResponse = await getPosts(ev.id);
          const postList = postsResponse.data || [];

          const draft = postList.find(
            (p) =>
              p.isDraft === true &&
              p.collaborators?.some((c) => c.isOwner && c.userId === user?.id),
          );

          if (draft) {
            foundDraft = draft;
            eventWithDraftId = ev.id;
            break;
          }
        }

        if (foundDraft) {
          setActiveDraftId(foundDraft.id);
          setSelectedEventId(eventWithDraftId);
          setTitle(foundDraft.title || "");
          setCaption(foundDraft.caption || "");
          setPostType(foundDraft.postType || "");
          setIsFeatured(foundDraft.isFeatured || false);
          setExistingMedia(foundDraft.media || []);

          try {
            const pollResponse = await getPoll(eventWithDraftId, foundDraft.id);
            if (pollResponse?.data) {
              setEnablePoll(true);
              setPollQuestion(pollResponse.data.question || "");
              setPollMaxChoices(pollResponse.data.maxChoices || 1);
              setPollOptions(
                pollResponse.data.options?.map((o) => o.value) || ["", ""],
              );
            }
          } catch {
            // Safe fallback if draft does not contain a nested active poll
          }
        } else {
          setSelectedEventId(availableEvents[0]?.id || "");
        }
      } catch (error) {
        console.error("Failed to synchronize active setup parameters:", error);
      } finally {
        setInitialLoading(false);
      }
    }
    if (user?.id) syncAndLoadData();
  }, [user]);

  const handleOptionChange = (index, value) => {
    const updated = [...pollOptions];
    updated[index] = value;
    setPollOptions(updated);
  };

  const addPollOption = () => {
    if (pollOptions.length < 20) {
      setPollOptions([...pollOptions, ""]);
    }
  };

  const removePollOption = (index) => {
    if (pollOptions.length > 2) {
      setPollOptions(pollOptions.filter((_, i) => i !== index));
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files) {
      setMediaFiles([...mediaFiles, ...Array.from(e.target.files)]);
    }
  };

  const handlePublishPost = async (e, shouldBeDraft = false) => {
    if (e) e.preventDefault();

    if (title.trim().length < 3)
      return alert("Title must be at least 3 characters long.");
    if (!selectedEventId) return alert("Please specify a target event.");

    try {
      setSubmitting(true);
      let postId = activeDraftId;

      const postPayload = {
        title: title.trim(),
        caption: caption.trim() || undefined,
        postType: postType || undefined,
        isFeatured,
        isDraft: shouldBeDraft,
      };

      if (!postId) {
        const newPostRes = await createPost(selectedEventId, postPayload);
        postId = newPostRes.data?.id || newPostRes.id;
        setActiveDraftId(postId);
        await updatePost(selectedEventId, postId, postPayload);
      } else {
        await updatePost(selectedEventId, postId, postPayload);
      }

      if (mediaFiles.length > 0) {
        for (const file of mediaFiles) {
          const formData = new FormData();
          formData.append("media", file);
          await createMediaPost(postId, formData);
        }
      }

      if (enablePoll) {
        const cleanedOptions = pollOptions
          .map((opt) => opt.trim())
          .filter((opt) => opt !== "");
        const parsedMaxChoices = parseInt(pollMaxChoices, 10) || 1;

        if (cleanedOptions.length < 2) {
          alert("Poll requires at least 2 non-empty unique options.");
          setSubmitting(false);
          return;
        }

        const uniqueCheckSet = new Set(
          cleanedOptions.map((o) => o.toLowerCase()),
        );
        if (uniqueCheckSet.size !== cleanedOptions.length) {
          alert("Duplicate options are not allowed within the poll.");
          setSubmitting(false);
          return;
        }

        if (parsedMaxChoices > cleanedOptions.length) {
          alert("Maximum choices cannot exceed the total number of options.");
          setSubmitting(false);
          return;
        }

        try {
          await deletePoll(selectedEventId, postId);
        } catch {
          /* Bypass safe hook */
        }

        await createPoll(selectedEventId, postId, {
          question: pollQuestion.trim(),
          maxChoices: parsedMaxChoices,
          options: cleanedOptions,
        });
      } else if (postId && !enablePoll) {
        try {
          await deletePoll(selectedEventId, postId);
        } catch {
          /* Bypass safe hook */
        }
      }

      if (shouldBeDraft) {
        setActiveDraftId(postId);
        navigate("/explore");
      } else {
        setActiveDraftId(null);
        navigate(`/posts/${selectedEventId}/${postId}`);
      }
    } catch (error) {
      console.error("Transaction deployment execution failed:", error);
      alert("Failed to securely broadcast post records to the cloud server.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelClick = () => {
    setShowCancelModal(true);
  };

  const saveAsDraftAndExit = async (e) => {
    setShowCancelModal(false);
    await handlePublishPost(e, true);
  };

  const discardDraftAndExit = async () => {
    setShowCancelModal(false);
    try {
      setSubmitting(true);

      let targetDraftId = activeDraftId;
      let targetEventId = selectedEventId;

      if (!targetDraftId || !targetEventId) {
        for (const ev of events) {
          const postsResponse = await getPosts(ev.id);
          const postList = postsResponse.data || [];
          const backupDraft = postList.find(
            (p) =>
              p.isDraft === true &&
              p.collaborators?.some((c) => c.isOwner && c.userId === user?.id),
          );
          if (backupDraft) {
            targetDraftId = backupDraft.id;
            targetEventId = ev.id;
            break;
          }
        }
      }

      if (targetDraftId && targetEventId) {
        await deletePost(targetEventId, targetDraftId);
      }
      navigate("/explore");
    } catch (err) {
      console.error("Draft purge failure:", err);
      navigate("/explore");
    } finally {
      setSubmitting(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="bg-background flex min-h-dvh items-center justify-center px-4 py-8 pb-28 sm:px-6 md:pb-8 md:pl-28 lg:px-10 lg:pl-32">
        <div className="border-brand h-10 w-10 animate-spin rounded-full border-4 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="bg-background text-text font-body min-h-dvh px-4 py-8 pb-28 sm:px-6 md:pb-8 md:pl-28 lg:px-10 lg:pl-32">
      <div className="mx-auto max-w-3xl">
        <button
          type="button"
          onClick={handleCancelClick}
          className="group text-text-soft hover:text-text mb-6 inline-flex cursor-pointer items-center gap-2 text-sm font-semibold transition"
        >
          <FontAwesomeIcon
            icon={faArrowLeft}
            className="transition group-hover:-translate-x-1"
          />
          <span>Back to Explore</span>
        </button>

        <div className="mb-8">
          <h1 className="font-heading text-text text-4xl font-bold tracking-tight sm:text-5xl">
            {activeDraftId ? "Resume Saved Draft" : "Orchestrate New Post"}
          </h1>
          <p className="text-text-soft mt-2 text-base">
            Compose verified announcements, projects, or reward elements
            directly to the feed.
          </p>
        </div>

        <form
          onSubmit={(e) => handlePublishPost(e, false)}
          className="space-y-6"
        >
          <div className="border-border bg-surface rounded-card space-y-5 border p-6 shadow-xs">
            <div className="flex flex-col gap-2">
              <label className="text-text-soft text-xs font-bold tracking-wider uppercase">
                Target Arena Event
              </label>
              <select
                disabled={!!activeDraftId}
                value={selectedEventId}
                onChange={(e) => setSelectedEventId(e.target.value)}
                className="border-border bg-background text-text rounded-card focus:border-brand cursor-pointer border px-4 py-3 text-sm font-medium transition outline-none disabled:opacity-60"
              >
                {events.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.name}
                  </option>
                ))}
              </select>
              {activeDraftId && (
                <p className="text-brand text-[11px] font-medium">
                  Event locked during targeted draft modification procedures.
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-text-soft text-xs font-bold tracking-wider uppercase">
                Post Title
              </label>
              <input
                type="text"
                placeholder="Enter a descriptive post title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="border-border bg-background text-text rounded-card placeholder:text-text-soft/50 focus:border-brand border px-4 py-3 text-sm font-medium transition outline-none"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-text-soft text-xs font-bold tracking-wider uppercase">
                Caption
              </label>
              <textarea
                rows={4}
                placeholder="Elaborate details on the announcements, instructions, or goals..."
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className="border-border bg-background text-text rounded-card placeholder:text-text-soft/50 focus:border-brand resize-none border p-4 text-sm font-medium transition outline-none"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 pt-2 md:grid-cols-2">
              <div className="flex flex-col gap-2">
                <label className="text-text-soft text-xs font-bold tracking-wider uppercase">
                  Post Category
                </label>
                <select
                  value={postType}
                  onChange={(e) => setPostType(e.target.value)}
                  className="border-border bg-background text-text rounded-card focus:border-brand cursor-pointer border px-4 py-3 text-sm font-medium transition outline-none"
                >
                  <option value="">Select a category (Optional)</option>
                  <option value="ANNOUNCEMENT">ANNOUNCEMENT</option>
                  <option value="PROJECT">PROJECT</option>
                  <option value="REWARD">REWARD</option>
                </select>
              </div>

              <div className="border-border bg-background rounded-card flex h-11.5 items-center gap-3 self-end border p-4">
                <input
                  type="checkbox"
                  id="isFeatured"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="border-border text-brand focus:ring-brand accent-brand h-4 w-4 cursor-pointer rounded-sm"
                />
                <label
                  htmlFor="isFeatured"
                  className="text-text cursor-pointer text-sm font-semibold select-none"
                >
                  Mark as Featured Post
                </label>
              </div>
            </div>
          </div>

          <div className="border-border bg-surface rounded-card space-y-4 border p-6 shadow-xs">
            <label className="text-text-soft block text-xs font-bold tracking-wider uppercase">
              Media Documents
            </label>

            {existingMedia.length > 0 && (
              <div className="space-y-2">
                <p className="text-text-soft text-xs font-semibold">
                  Attached Files:
                </p>
                <div className="flex flex-wrap gap-2">
                  {existingMedia.map((m, idx) => (
                    <div
                      key={idx}
                      className="bg-background border-border rounded-base relative h-16 w-16 overflow-hidden border"
                    >
                      <img
                        src={m.url}
                        alt="cloud resource reference"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="border-border bg-background rounded-card hover:border-brand group relative border border-dashed p-6 text-center transition">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
              />
              <FontAwesomeIcon
                icon={faCloudArrowUp}
                className="text-brand mb-2 text-2xl transition group-hover:scale-105"
              />
              <p className="text-text text-sm font-semibold">
                Drag files here or click to assign assets
              </p>
              <p className="text-text-soft mt-0.5 text-xs">
                High-fidelity image sets are supported
              </p>
            </div>

            {mediaFiles.length > 0 && (
              <div className="pt-2">
                <p className="text-text-soft mb-2 text-xs font-semibold">
                  Staged upload list ({mediaFiles.length}):
                </p>
                <ul className="text-brand bg-background border-border/60 rounded-base space-y-1 border p-3 text-xs font-medium">
                  {mediaFiles.map((f, i) => (
                    <li key={i} className="truncate">
                      ✓ {f.name} ({(f.size / 1024).toFixed(1)} KB)
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="border-border bg-surface rounded-card space-y-5 border p-6 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FontAwesomeIcon
                  icon={faSquarePollHorizontal}
                  className="text-brand"
                />
                <label
                  className="text-text cursor-pointer text-sm font-bold tracking-wider uppercase select-none"
                  htmlFor="enablePoll"
                >
                  Deploy Feedback Poll Matrix
                </label>
              </div>
              <input
                type="checkbox"
                id="enablePoll"
                checked={enablePoll}
                onChange={(e) => setEnablePoll(e.target.checked)}
                className="border-border text-brand focus:ring-brand accent-brand h-4 w-4 cursor-pointer rounded-sm"
              />
            </div>

            {enablePoll && (
              <div className="border-border/40 space-y-4 border-t pt-4">
                <div className="flex flex-col gap-2">
                  <label className="text-text-soft text-xs font-bold tracking-wider uppercase">
                    Poll Question
                  </label>
                  <input
                    type="text"
                    placeholder="Enter the main inquiry description..."
                    value={pollQuestion}
                    onChange={(e) => setPollQuestion(e.target.value)}
                    className="border-border bg-background text-text rounded-card placeholder:text-text-soft/50 focus:border-brand border px-4 py-3 text-sm font-medium transition outline-none"
                    required={enablePoll}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-text-soft text-xs font-bold tracking-wider uppercase">
                    Maximum Choices Allowed
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={pollOptions.length}
                    value={pollMaxChoices}
                    onChange={(e) => setPollMaxChoices(e.target.value)}
                    className="border-border bg-background text-text rounded-card focus:border-brand w-24 border px-4 py-2.5 text-sm font-medium outline-none"
                  />
                </div>

                <div className="space-y-2.5">
                  <label className="text-text-soft block text-xs font-bold tracking-wider uppercase">
                    Options Selection Deck
                  </label>
                  {pollOptions.map((option, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder={`Option Allocation Choice #${index + 1}`}
                        value={option}
                        onChange={(e) =>
                          handleOptionChange(index, e.target.value)
                        }
                        className="border-border bg-background text-text rounded-card focus:border-brand w-full border px-4 py-2.5 text-sm font-medium transition outline-none"
                        required={enablePoll && index < 2}
                      />
                      {pollOptions.length > 2 && (
                        <button
                          type="button"
                          onClick={() => removePollOption(index)}
                          className="text-text-soft cursor-pointer p-2.5 transition hover:text-rose-600"
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      )}
                    </div>
                  ))}

                  {pollOptions.length < 20 && (
                    <button
                      type="button"
                      onClick={addPollOption}
                      className="text-brand hover:text-accent mt-2 inline-flex cursor-pointer items-center gap-1.5 text-xs font-bold"
                    >
                      <FontAwesomeIcon icon={faPlus} /> Append Alternative
                      Option
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col items-center justify-end gap-3 pt-4 sm:flex-row">
            <button
              type="button"
              onClick={handleCancelClick}
              disabled={submitting}
              className="rounded-base border-border bg-surface hover:bg-background text-text w-full cursor-pointer border px-6 py-3 text-xs font-bold tracking-wider uppercase transition disabled:opacity-50 sm:w-auto"
            >
              Cancel Setup
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="bg-brand rounded-base flex w-full cursor-pointer items-center justify-center gap-2 px-6 py-3 text-xs font-bold tracking-wider text-white uppercase shadow-xs transition hover:opacity-90 disabled:opacity-50 sm:w-auto"
            >
              <FontAwesomeIcon icon={faPaperPlane} />
              {submitting ? "Processing..." : "Publish Content"}
            </button>
          </div>
        </form>

        {showCancelModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 p-4 backdrop-blur-xs">
            <div className="border-border bg-surface rounded-card w-full max-w-md border p-6 shadow-2xl">
              <h3 className="font-heading text-text text-2xl font-bold">
                Cancellation Protocol
              </h3>
              <p className="text-text-soft mt-2 text-sm leading-relaxed">
                Would you like to register this content and active metrics setup
                as a secure draft ledger inside the database before exiting the
                console?
              </p>

              <div className="mt-6 flex flex-col gap-2.5">
                <button
                  type="button"
                  onClick={(e) => saveAsDraftAndExit(e)}
                  className="bg-brand rounded-base flex w-full cursor-pointer items-center justify-center gap-2 py-3 text-xs font-bold tracking-wider text-white uppercase transition hover:opacity-95"
                >
                  <FontAwesomeIcon icon={faFloppyDisk} /> Save As Secure System
                  Draft
                </button>
                <button
                  type="button"
                  onClick={discardDraftAndExit}
                  className="rounded-base flex w-full cursor-pointer items-center justify-center gap-2 bg-rose-600 py-3 text-xs font-bold tracking-wider text-white uppercase transition hover:bg-rose-700"
                >
                  <FontAwesomeIcon icon={faTrash} /> Purge & Discard Workspace
                  Completely
                </button>
                <button
                  type="button"
                  onClick={() => setShowCancelModal(false)}
                  className="border-border bg-background text-text hover:bg-surface rounded-base w-full cursor-pointer border py-2.5 text-xs font-bold tracking-wider uppercase transition"
                >
                  Resume Modifying Input
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
