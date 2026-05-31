import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartSimple, faCheck } from "@fortawesome/free-solid-svg-icons";
import { vote, unvote } from "../../../api/poll-votes";

export default function PostPollSection({ poll, eventId, postId, user }) {
  const [pollData, setPollData] = useState(poll);
  const [selectedIds, setSelectedIds] = useState(() => {
    // Derive already-voted options from poll data if backend returns user votes
    return poll?.options?.filter((o) => o.isVoted).map((o) => o.id) || [];
  });
  const [submitting, setSubmitting] = useState(false);

  if (!pollData) return null;

  const totalVotes = pollData._count?.votes || 0;
  const maxChoices = pollData.maxChoices || 1;
  const hasVoted = selectedIds.length > 0;

  const getVotePercent = (option) => {
    const votes = option._count?.votes || 0;
    if (totalVotes === 0) return 0;
    return Math.round((votes / totalVotes) * 100);
  };

  const toggleOption = (optionId) => {
    if (!user) return;
    if (selectedIds.includes(optionId)) {
      setSelectedIds((prev) => prev.filter((id) => id !== optionId));
    } else {
      if (selectedIds.length >= maxChoices) {
        // Replace last if single choice, or ignore if at max
        if (maxChoices === 1) {
          setSelectedIds([optionId]);
        }
      } else {
        setSelectedIds((prev) => [...prev, optionId]);
      }
    }
  };

  const handleVote = async () => {
    if (!user || selectedIds.length === 0) return;
    try {
      setSubmitting(true);
      await vote(eventId, postId, { optionIds: selectedIds });
      // Optimistically update vote counts
      setPollData((prev) => ({
        ...prev,
        options: prev.options.map((o) => ({
          ...o,
          _count: {
            votes: selectedIds.includes(o.id)
              ? (o._count?.votes || 0) + 1
              : o._count?.votes || 0,
          },
        })),
        _count: { votes: (prev._count?.votes || 0) + selectedIds.length },
      }));
    } catch (err) {
      console.error("Vote failed:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleClearVote = async () => {
    if (!user) return;
    try {
      setSubmitting(true);
      await unvote(eventId, postId);
      setSelectedIds([]);
      // Optimistically revert
      setPollData((prev) => ({
        ...prev,
        options: prev.options.map((o) => ({
          ...o,
          _count: {
            votes: Math.max(0, o._count?.votes || 0),
          },
        })),
      }));
    } catch (err) {
      console.error("Unvote failed:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="border-border bg-surface rounded-card border p-5 shadow-xs">
      <div className="mb-4 flex items-center gap-2">
        <FontAwesomeIcon icon={faChartSimple} className="text-brand text-sm" />
        <span className="text-text-soft text-xs font-bold tracking-wider uppercase">
          Community Poll
        </span>
        <span className="text-text-soft ml-auto text-xs">
          {totalVotes} vote{totalVotes !== 1 ? "s" : ""}
          {maxChoices > 1 && ` · Choose up to ${maxChoices}`}
        </span>
      </div>

      <p className="text-text mb-4 text-sm font-semibold">
        {pollData.question}
      </p>

      <div className="space-y-2.5">
        {pollData.options.map((option) => {
          const percent = getVotePercent(option);
          const isSelected = selectedIds.includes(option.id);

          return (
            <div
              key={option.id}
              onClick={() => toggleOption(option.id)}
              className={`relative cursor-pointer overflow-hidden rounded-sm border transition ${
                isSelected
                  ? "border-brand"
                  : "border-border hover:border-brand/50"
              } ${!user ? "cursor-default" : ""}`}
            >
              {/* progress bar background */}
              <div
                className="absolute inset-0 transition-all duration-500"
                style={{
                  width: `${percent}%`,
                  backgroundColor: isSelected
                    ? "var(--color-brand, #6366f1)22"
                    : "var(--color-border, #e5e7eb)",
                  opacity: 0.5,
                }}
              />
              <div className="relative flex items-center justify-between px-3 py-2.5">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border transition ${
                      isSelected
                        ? "bg-brand border-brand text-white"
                        : "border-border"
                    }`}
                  >
                    {isSelected && (
                      <FontAwesomeIcon icon={faCheck} className="text-[9px]" />
                    )}
                  </div>
                  <span className="text-text text-sm font-medium">
                    {option.value}
                  </span>
                </div>
                <span className="text-text-soft text-xs font-semibold">
                  {percent}%
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {user && (
        <div className="mt-4 flex gap-2">
          <button
            onClick={handleVote}
            disabled={submitting || selectedIds.length === 0}
            className="bg-brand rounded-base cursor-pointer px-4 py-2 text-xs font-bold tracking-wider text-white uppercase transition hover:opacity-90 disabled:opacity-50"
          >
            {submitting ? "Submitting..." : "Submit Vote"}
          </button>
          {hasVoted && (
            <button
              onClick={handleClearVote}
              disabled={submitting}
              className="border-border rounded-base cursor-pointer border px-4 py-2 text-xs font-bold tracking-wider text-rose-600 uppercase transition hover:bg-rose-50 disabled:opacity-50"
            >
              Clear Vote
            </button>
          )}
        </div>
      )}

      {!user && (
        <p className="text-text-soft mt-3 text-xs">
          Login to participate in this poll.
        </p>
      )}
    </div>
  );
}
