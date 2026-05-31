import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faCloudArrowUp,
  faPlus,
  faTrash,
  faSquarePollHorizontal,
  faPaperPlane,
} from "@fortawesome/free-solid-svg-icons";

import { getPostById, updatePost } from "../../api/posts";
import { createMediaPost } from "../../api/media";
import { createPoll, getPoll, deletePoll } from "../../api/polls";

export default function EditPost() {
  const navigate = useNavigate();
  const { eventId, postId } = useParams();

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

  const [initialLoading, setInitialLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function loadPost() {
      try {
        setInitialLoading(true);

        const postRes = await getPostById(eventId, postId);
        const post = postRes?.data || postRes;

        setTitle(post.title || "");
        setCaption(post.caption || "");
        setPostType(post.postType || "");
        setIsFeatured(post.isFeatured || false);
        setExistingMedia(post.media || []);

        try {
          const pollRes = await getPoll(eventId, postId);
          if (pollRes?.data) {
            setEnablePoll(true);
            setPollQuestion(pollRes.data.question || "");
            setPollMaxChoices(pollRes.data.maxChoices || 1);
            setPollOptions(
              pollRes.data.options?.map((o) => o.value) || ["", ""],
            );
          }
        } catch {
          // Post has no poll, safe to ignore
        }
      } catch (error) {
        console.error("Failed to load post for editing:", error);
        alert("Failed to load post data.");
        navigate(-1);
      } finally {
        setInitialLoading(false);
      }
    }

    loadPost();
  }, [eventId, postId, navigate]);

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

  const handleSave = async (e) => {
    if (e) e.preventDefault();

    if (title.trim().length < 3)
      return alert("Title must be at least 3 characters long.");

    try {
      setSubmitting(true);

      const postPayload = {
        title: title.trim(),
        caption: caption.trim() || undefined,
        postType: postType || undefined,
        isFeatured,
        isDraft: false,
      };

      await updatePost(eventId, postId, postPayload);

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
          await deletePoll(eventId, postId);
        } catch {
          /* Bypass safe hook */
        }

        await createPoll(eventId, postId, {
          question: pollQuestion.trim(),
          maxChoices: parsedMaxChoices,
          options: cleanedOptions,
        });
      } else {
        try {
          await deletePoll(eventId, postId);
        } catch {
          /* Bypass safe hook */
        }
      }

      navigate(`/posts/${eventId}/${postId}`);
    } catch (error) {
      console.error("Failed to save post:", error);
      alert("Failed to save changes to the post.");
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
          onClick={() => navigate(-1)}
          className="group text-text-soft hover:text-text mb-6 inline-flex cursor-pointer items-center gap-2 text-sm font-semibold transition"
        >
          <FontAwesomeIcon
            icon={faArrowLeft}
            className="transition group-hover:-translate-x-1"
          />
          <span>Back</span>
        </button>

        <div className="mb-8">
          <h1 className="font-heading text-text text-4xl font-bold tracking-tight sm:text-5xl">
            Edit Post
          </h1>
          <p className="text-text-soft mt-2 text-base">
            Modify the content, media, or poll attached to this post.
          </p>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          {/* CORE FIELDS */}
          <div className="border-border bg-surface rounded-card space-y-5 border p-6 shadow-xs">
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

          {/* MEDIA */}
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

          {/* POLL */}
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

          {/* ACTIONS */}
          <div className="flex flex-col items-center justify-end gap-3 pt-4 sm:flex-row">
            <button
              type="button"
              onClick={() => navigate(-1)}
              disabled={submitting}
              className="rounded-base border-border bg-surface hover:bg-background text-text w-full cursor-pointer border px-6 py-3 text-xs font-bold tracking-wider uppercase transition disabled:opacity-50 sm:w-auto"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="bg-brand rounded-base flex w-full cursor-pointer items-center justify-center gap-2 px-6 py-3 text-xs font-bold tracking-wider text-white uppercase shadow-xs transition hover:opacity-90 disabled:opacity-50 sm:w-auto"
            >
              <FontAwesomeIcon icon={faPaperPlane} />
              {submitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
