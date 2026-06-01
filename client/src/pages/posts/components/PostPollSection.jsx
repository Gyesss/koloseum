import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartSimple,
  faCheck,
  faCircleCheck,
} from "@fortawesome/free-solid-svg-icons";
import { vote, unvote } from "../../../api/poll-votes";

export default function PostPollSection({ poll, eventId, postId, user }) {
  const [pollData, setPollData] = useState(poll);
  const [selectedIds, setSelectedIds] = useState(
    () => poll?.options?.filter((o) => o.isVoted).map((o) => o.id) || [],
  );
  const [hasSubmitted, setHasSubmitted] = useState(
    () => poll?.options?.some((o) => o.isVoted) || false,
  );
  const [submitting, setSubmitting] = useState(false);

  if (!pollData) return null;

  const totalVotes = pollData._count?.votes || 0;
  const maxChoices = pollData.maxChoices || 1;
  const isMultiChoice = maxChoices > 1;

  const getVotePercent = (option) => {
    const votes = option._count?.votes || 0;
    if (totalVotes === 0) return 0;
    return Math.round((votes / totalVotes) * 100);
  };

  const toggleOption = (optionId) => {
    if (!user || hasSubmitted) return;
    setSelectedIds((prev) => {
      if (prev.includes(optionId)) {
        return prev.filter((id) => id !== optionId);
      }
      if (prev.length >= maxChoices) {
        // Single choice: replace. Multi: ignore at max.
        return maxChoices === 1 ? [optionId] : prev;
      }
      return [...prev, optionId];
    });
  };

  const handleVote = async () => {
    if (!user || selectedIds.length === 0 || submitting) return;
    try {
      setSubmitting(true);
      await vote(eventId, postId, { optionIds: selectedIds });
      setPollData((prev) => ({
        ...prev,
        options: prev.options.map((o) => ({
          ...o,
          isVoted: selectedIds.includes(o.id),
          _count: {
            votes: selectedIds.includes(o.id)
              ? (o._count?.votes || 0) + 1
              : o._count?.votes || 0,
          },
        })),
        _count: { votes: (prev._count?.votes || 0) + selectedIds.length },
      }));
      setHasSubmitted(true);
    } catch (err) {
      console.error("Vote failed:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleClearVote = async () => {
    if (!user || submitting) return;
    try {
      setSubmitting(true);
      await unvote(eventId, postId);
      setPollData((prev) => ({
        ...prev,
        options: prev.options.map((o) => ({
          ...o,
          isVoted: false,
          _count: {
            votes: Math.max(
              0,
              (o._count?.votes || 0) - (selectedIds.includes(o.id) ? 1 : 0),
            ),
          },
        })),
        _count: {
          votes: Math.max(0, (prev._count?.votes || 0) - selectedIds.length),
        },
      }));
      setSelectedIds([]);
      setHasSubmitted(false);
    } catch (err) {
      console.error("Unvote failed:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-surface border-border rounded-card overflow-hidden border shadow-sm">
      {/* HEADER */}
      <div className="border-border border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FontAwesomeIcon
              icon={faChartSimple}
              className="text-brand text-sm"
            />
            <span className="text-text text-sm font-bold tracking-wide">
              Community Poll
            </span>
          </div>
          <div className="flex items-center gap-3">
            {hasSubmitted && (
              <span className="text-brand flex items-center gap-1 text-xs font-semibold">
                <FontAwesomeIcon icon={faCircleCheck} />
                Voted
              </span>
            )}
            <span className="text-text-soft text-xs">
              {totalVotes} vote{totalVotes !== 1 ? "s" : ""}
            </span>
          </div>
        </div>

        <p className="text-text mt-2 text-sm leading-snug font-semibold">
          {pollData.question}
        </p>

        {/* CHOICE INSTRUCTION */}
        <p className="text-text-soft mt-1 text-xs">
          {hasSubmitted
            ? "Your vote has been recorded."
            : isMultiChoice
              ? `Select up to ${maxChoices} option${maxChoices > 1 ? "s" : ""} · ${selectedIds.length}/${maxChoices} chosen`
              : "Select one option"}
        </p>
      </div>

      {/* OPTIONS */}
      <div className="space-y-2 px-6 py-4">
        {pollData.options.map((option) => {
          const percent = getVotePercent(option);
          const isSelected = selectedIds.includes(option.id);
          const wasVoted = option.isVoted;
          const isAtMax = selectedIds.length >= maxChoices && !isSelected;
          const interactive = user && !hasSubmitted;

          return (
            <div
              key={option.id}
              onClick={() => interactive && !isAtMax && toggleOption(option.id)}
              className={`relative overflow-hidden rounded-sm border transition-all duration-200 ${
                interactive && !isAtMax ? "cursor-pointer" : "cursor-default"
              } ${
                isSelected
                  ? "border-brand"
                  : wasVoted
                    ? "border-brand/50"
                    : "border-border"
              } ${
                interactive && !isAtMax && !isSelected
                  ? "hover:border-brand/60"
                  : ""
              } ${interactive && isAtMax && !isSelected ? "opacity-50" : ""}`}
            >
              {/* PROGRESS BAR */}
              <div
                className="absolute inset-0 transition-all duration-700"
                style={{
                  width: `${percent}%`,
                  backgroundColor:
                    isSelected || wasVoted
                      ? "var(--color-brand)"
                      : "var(--color-border)",
                  opacity: isSelected || wasVoted ? 0.15 : 0.25,
                }}
              />

              <div className="relative flex items-center justify-between px-3 py-2.5">
                <div className="flex items-center gap-2.5">
                  {/* CHECKBOX / RADIO INDICATOR */}
                  <div
                    className={`flex h-4 w-4 shrink-0 items-center justify-center border transition ${
                      isMultiChoice ? "rounded-sm" : "rounded-full"
                    } ${
                      isSelected || wasVoted
                        ? "bg-brand border-brand text-white"
                        : "border-border bg-background"
                    }`}
                  >
                    {(isSelected || wasVoted) && (
                      <FontAwesomeIcon icon={faCheck} className="text-[8px]" />
                    )}
                  </div>
                  <span className="text-text text-sm font-medium">
                    {option.value}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-text-soft text-xs font-semibold tabular-nums">
                    {percent}%
                  </span>
                  {(hasSubmitted || totalVotes > 0) && (
                    <span className="text-text-soft/60 text-[10px]">
                      ({option._count?.votes || 0})
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* FOOTER ACTIONS */}
      <div className="border-border border-t px-6 py-4">
        {user ? (
          <div className="flex items-center gap-2">
            {!hasSubmitted ? (
              <button
                onClick={handleVote}
                disabled={submitting || selectedIds.length === 0}
                className="bg-brand rounded-base cursor-pointer px-4 py-2 text-xs font-bold tracking-wider text-white uppercase transition hover:opacity-90 disabled:opacity-50"
              >
                {submitting
                  ? "Submitting..."
                  : `Submit Vote${selectedIds.length > 1 ? `s (${selectedIds.length})` : ""}`}
              </button>
            ) : (
              <button
                onClick={handleClearVote}
                disabled={submitting}
                className="border-border rounded-base cursor-pointer border px-4 py-2 text-xs font-bold tracking-wider text-rose-600 uppercase transition hover:bg-rose-50 disabled:opacity-50"
              >
                {submitting ? "Clearing..." : "Clear Vote"}
              </button>
            )}
            {!hasSubmitted && selectedIds.length > 0 && (
              <button
                onClick={() => setSelectedIds([])}
                className="text-text-soft hover:text-text cursor-pointer text-xs font-medium transition"
              >
                Reset
              </button>
            )}
          </div>
        ) : (
          <p className="text-text-soft text-xs">
            Login to participate in this poll.
          </p>
        )}
      </div>
    </div>
  );
}
