import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faTrash,
  faEdit,
  faCheck,
  faTimes,
  faCalendarCheck,
  faMicrophone,
  faUsers,
  faMusic,
  faFlagCheckered,
  faHandshake,
  faMugHot,
  faTrophy,
} from "@fortawesome/free-solid-svg-icons";

const TYPE_CONFIG = {
  CEREMONIAL: {
    icon: faFlagCheckered,
    color: "text-amber-700",
    bg: "bg-amber-100",
  },

  OPENING: {
    icon: faHandshake,
    color: "text-sky-700",
    bg: "bg-sky-100",
  },

  MC: {
    icon: faMicrophone,
    color: "text-violet-700",
    bg: "bg-violet-100",
  },

  SHOW: {
    icon: faMusic,
    color: "text-pink-700",
    bg: "bg-pink-100",
  },

  CONTEST: {
    icon: faTrophy,
    color: "text-emerald-700",
    bg: "bg-emerald-100",
  },

  ICE_BREAKING: {
    icon: faUsers,
    color: "text-cyan-700",
    bg: "bg-cyan-100",
  },

  BREAKS: {
    icon: faMugHot,
    color: "text-orange-700",
    bg: "bg-orange-100",
  },

  CLOSING: {
    icon: faFlagCheckered,
    color: "text-rose-700",
    bg: "bg-rose-100",
  },

  OTHER: {
    icon: faCalendarCheck,
    color: "text-slate-700",
    bg: "bg-slate-100",
  },
};

export default function TimelineSection({
  timelines,
  canManage,
  onCreate,
  onUpdate,
  onDelete,
}) {
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const now = new Date();

  const getInitialTimes = () => {
    const start = new Date();
    const end = new Date(start.getTime() + 60 * 60 * 1000);
    const tzOffset = start.getTimezoneOffset() * 60000;
    return {
      start: new Date(start - tzOffset).toISOString().slice(0, 16),
      end: new Date(end - tzOffset).toISOString().slice(0, 16),
    };
  };

  const getTimeLeft = (targetDate) => {
    const diff = targetDate - now;
    if (diff < 0) return "Passed";
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} day${days > 1 ? "s" : ""} left`;
    if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} left`;
    return `${minutes} minute${minutes !== 1 ? "s" : ""} left`;
  };

  const toLocalInputValue = (isoString) => {
    const date = new Date(isoString);
    const tzOffset = date.getTimezoneOffset() * 60000;
    return new Date(date - tzOffset).toISOString().slice(0, 16);
  };

  const startEdit = (timeline) => {
    setEditingId(timeline.id);
    setEditForm({
      name: timeline.name || "",
      additional: timeline.additional || "",
      type: timeline.type || "OTHER",
      startAt: toLocalInputValue(timeline.startAt),
      endAt: toLocalInputValue(timeline.endAt),
    });
  };

  const handleUpdate = async (id, data) => {
    try {
      await onUpdate(id, data);
      setEditingId(null);
    } catch (err) {
      alert("Failed to update: " + (err.message || "Unknown error"));
    }
  };

  const getTimeRemaining = (endDate) => {
    const diff = endDate - now;
    if (diff <= 0) return null;
    const totalMinutes = Math.floor(diff / 60000);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    if (hours > 0) return `${hours}h ${minutes}m remaining`;
    return `${minutes}m remaining`;
  };

  return (
    <div className="font-body space-y-10">
      {canManage && (
        <div className="border-border bg-surface rounded-card space-y-5 border p-8 shadow-sm">
          <h3 className="font-heading text-text text-3xl font-semibold">
            Add New Milestone
          </h3>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              onCreate(Object.fromEntries(formData));
              e.target.reset();
            }}
            className="grid grid-cols-1 gap-4 md:grid-cols-2"
          >
            <input
              name="name"
              placeholder="Activity Name"
              required
              className="border-border bg-background text-text rounded-base focus:border-brand border px-4 py-3 text-sm font-medium transition outline-none"
            />
            <select
              name="type"
              className="border-border bg-background text-text rounded-base focus:border-brand cursor-pointer border px-4 py-3 text-sm font-medium transition outline-none"
            >
              {Object.keys(TYPE_CONFIG).map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            <input
              type="datetime-local"
              name="startAt"
              defaultValue={getInitialTimes().start}
              required
              className="border-border bg-background text-text rounded-base focus:border-brand border px-4 py-3 text-sm font-medium transition outline-none"
            />
            <input
              type="datetime-local"
              name="endAt"
              defaultValue={getInitialTimes().end}
              required
              className="border-border bg-background text-text rounded-base focus:border-brand border px-4 py-3 text-sm font-medium transition outline-none"
            />
            <textarea
              name="additional"
              placeholder="Additional details..."
              className="border-border bg-background text-text rounded-base focus:border-brand resize-none border p-4 text-sm font-medium transition outline-none md:col-span-2"
            />
            <button
              type="submit"
              className="rounded-base bg-brand cursor-pointer px-6 py-3 text-xs font-bold tracking-widest text-white uppercase transition hover:opacity-90 md:col-span-2"
            >
              <FontAwesomeIcon icon={faPlus} className="mr-2" /> Add to Timeline
            </button>
          </form>
        </div>
      )}

      {timelines.length > 0 && (
        <div className="relative ml-4 md:ml-4">
          <div className="bg-border absolute top-4 bottom-4 left-3.75 w-0.5" />
          <div className="space-y-12">
            {timelines
              .sort((a, b) => new Date(a.startAt) - new Date(b.startAt))
              .map((t) => {
                const config = TYPE_CONFIG[t.type] || TYPE_CONFIG.OTHER;
                const start = new Date(t.startAt);
                const end = new Date(t.endAt);
                const isPast = now > end;
                const isActive = now >= start && now <= end;
                const progress = isActive
                  ? ((now - start) / (end - start)) * 100
                  : 0;

                return (
                  <div
                    key={t.id}
                    className={`relative flex gap-8 transition-opacity duration-300 ${isPast ? "opacity-60" : "opacity-100"}`}
                  >
                    <div
                      className={`border-background absolute left-0 flex h-8 w-8 items-center justify-center rounded-full border-2 shadow-sm ${config.bg} ${config.color} ${isActive ? "ring-brand ring-2" : ""}`}
                    >
                      <FontAwesomeIcon icon={config.icon} size="sm" />
                    </div>

                    <div className="w-full pl-12">
                      {editingId === t.id ? (
                        <div className="bg-surface rounded-card border-border space-y-4 border p-6">
                          <input
                            value={editForm.name}
                            onChange={(e) =>
                              setEditForm({ ...editForm, name: e.target.value })
                            }
                            className="border-border bg-background text-text rounded-base focus:border-brand w-full border px-4 py-3 text-sm font-medium outline-none"
                          />
                          <div className="grid grid-cols-2 gap-4">
                            <input
                              type="datetime-local"
                              value={editForm.startAt}
                              onChange={(e) =>
                                setEditForm({
                                  ...editForm,
                                  startAt: e.target.value,
                                })
                              }
                              className="border-border bg-background text-text rounded-base focus:border-brand border px-4 py-3 text-sm outline-none"
                            />
                            <input
                              type="datetime-local"
                              value={editForm.endAt}
                              onChange={(e) =>
                                setEditForm({
                                  ...editForm,
                                  endAt: e.target.value,
                                })
                              }
                              className="border-border bg-background text-text rounded-base focus:border-brand border px-4 py-3 text-sm outline-none"
                            />
                          </div>
                          <textarea
                            value={editForm.additional}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                additional: e.target.value,
                              })
                            }
                            className="border-border bg-background text-text rounded-base focus:border-brand w-full resize-none border p-3 text-sm outline-none"
                            placeholder="Add details..."
                          />
                          <div className="flex justify-end gap-3">
                            <button
                              onClick={() => handleUpdate(t.id, editForm)}
                              className="rounded-base bg-brand px-4 py-2 text-sm font-bold text-white"
                            >
                              <FontAwesomeIcon icon={faCheck} />
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="rounded-base bg-text-soft px-4 py-2 text-sm font-bold text-white"
                            >
                              <FontAwesomeIcon icon={faTimes} />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="group">
                          <div className="flex flex-col gap-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span
                                className={`rounded-full px-2 py-0.5 text-[10px] font-bold tracking-widest uppercase ${config.bg} ${config.color}`}
                              >
                                {t.type}
                              </span>
                              {isActive ? (
                                <span className="bg-brand/10 text-brand animate-pulse rounded-full px-2 py-0.5 text-[10px] font-bold tracking-widest uppercase">
                                  LIVE NOW
                                </span>
                              ) : (
                                <span className="text-text-soft text-[10px] font-bold tracking-widest uppercase">
                                  {getTimeLeft(start)}
                                </span>
                              )}
                            </div>
                            <div className="text-brand text-[10px] font-bold tracking-widest uppercase">
                              <span>
                                {start.toLocaleDateString()}{" "}
                                {start.toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>
                              <span className="mx-1">-</span>
                              <span>
                                {end.toLocaleDateString()}{" "}
                                {end.toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>
                            </div>
                          </div>

                          <h4 className="font-heading text-text mt-1 text-3xl font-semibold">
                            {t.name}
                          </h4>
                          {isActive && (
                            <div className="mt-2 flex max-w-sm items-center gap-3">
                              <div className="bg-border/30 h-1 flex-1 rounded-full">
                                <div
                                  className="bg-brand h-full rounded-full transition-all duration-500"
                                  style={{ width: `${progress}%` }}
                                />
                              </div>
                              <span className="text-text-soft text-[10px] font-bold tracking-widest whitespace-nowrap uppercase">
                                {getTimeRemaining(end)}
                              </span>
                            </div>
                          )}
                          <p className="text-text-soft mt-1 max-w-xl text-sm leading-relaxed">
                            {t.additional}
                          </p>
                          {canManage && (
                            <div className="mt-3 flex gap-4 opacity-0 transition group-hover:opacity-100">
                              <button
                                onClick={() => startEdit(t)}
                                className="text-text-soft hover:text-brand text-sm"
                              >
                                <FontAwesomeIcon
                                  icon={faEdit}
                                  className="mr-1"
                                />{" "}
                                Edit
                              </button>
                              <button
                                onClick={() => onDelete(t.id)}
                                className="text-text-soft text-sm hover:text-red-600"
                              >
                                <FontAwesomeIcon
                                  icon={faTrash}
                                  className="mr-1"
                                />{" "}
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
}
