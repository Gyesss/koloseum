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
  faClock,
  faFlagCheckered,
} from "@fortawesome/free-solid-svg-icons";

const TYPE_ICONS = {
  CEREMONIAL: faFlagCheckered,
  OPENING: faCalendarCheck,
  MC: faMicrophone,
  SHOW: faMusic,
  CONTEST: faUsers,
  ICE_BREAKING: faUsers,
  BREAKS: faClock,
  CLOSING: faFlagCheckered,
  OTHER: faCalendarCheck,
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
    return {
      start: start.toISOString().slice(0, 16),
      end: end.toISOString().slice(0, 16),
    };
  };

  const startEdit = (timeline) => {
    setEditingId(timeline.id);
    setEditForm({
      name: timeline.name,
      additional: timeline.additional || "",
      type: timeline.type,
      startAt: timeline.startAt.slice(0, 16),
      endAt: timeline.endAt.slice(0, 16),
    });
  };

  return (
    <div className="space-y-10">
      {canManage && (
        <div className="border-border bg-surface rounded-card space-y-5 border p-6 shadow-xs">
          <h3 className="font-heading text-text text-2xl font-bold">
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
              className="border-border bg-background text-text rounded-card focus:border-brand border px-4 py-3 text-sm font-medium transition outline-none"
            />
            <select
              name="type"
              className="border-border bg-background text-text rounded-card focus:border-brand cursor-pointer border px-4 py-3 text-sm font-medium transition outline-none"
            >
              {Object.keys(TYPE_ICONS).map((t) => (
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
              className="border-border bg-background text-text rounded-card focus:border-brand border px-4 py-3 text-sm font-medium transition outline-none"
            />
            <input
              type="datetime-local"
              name="endAt"
              defaultValue={getInitialTimes().end}
              required
              className="border-border bg-background text-text rounded-card focus:border-brand border px-4 py-3 text-sm font-medium transition outline-none"
            />
            <textarea
              name="additional"
              placeholder="Additional details..."
              className="border-border bg-background text-text rounded-card focus:border-brand resize-none border p-4 text-sm font-medium transition outline-none md:col-span-2"
            />
            <button
              type="submit"
              className="bg-brand rounded-card cursor-pointer px-6 py-3 text-xs font-bold tracking-wider text-white uppercase transition hover:opacity-90 md:col-span-2"
            >
              <FontAwesomeIcon icon={faPlus} />
              Add to Timeline
            </button>
          </form>
        </div>
      )}

      <div className="border-border relative ml-4 space-y-12 border-l-2 pl-8 md:ml-8">
        {timelines
          .sort((a, b) => new Date(a.startAt) - new Date(b.startAt))
          .map((t) => {
            const Icon = TYPE_ICONS[t.type] || faCalendarCheck;
            const start = new Date(t.startAt);
            const end = new Date(t.endAt);
            const isActive = now >= start && now <= end;

            return (
              <div key={t.id} className="relative">
                <div
                  className={`border-brand text-brand absolute top-0 -left-10.25 flex h-8 w-8 items-center justify-center rounded-full border-2 bg-white ${isActive ? "ring-brand/20 ring-4" : ""}`}
                >
                  <FontAwesomeIcon icon={Icon} size="sm" />
                </div>

                {editingId === t.id ? (
                  <div className="bg-surface rounded-card border-border space-y-3 border p-4">
                    <input
                      value={editForm.name}
                      onChange={(e) =>
                        setEditForm({ ...editForm, name: e.target.value })
                      }
                      className="border-border w-full border-b bg-transparent p-1 outline-none"
                    />
                    <div className="flex gap-2">
                      <input
                        type="datetime-local"
                        value={editForm.startAt}
                        onChange={(e) =>
                          setEditForm({ ...editForm, startAt: e.target.value })
                        }
                        className="rounded border p-1 text-xs"
                      />
                      <input
                        type="datetime-local"
                        value={editForm.endAt}
                        onChange={(e) =>
                          setEditForm({ ...editForm, endAt: e.target.value })
                        }
                        className="rounded border p-1 text-xs"
                      />
                    </div>
                    <textarea
                      value={editForm.additional}
                      onChange={(e) =>
                        setEditForm({ ...editForm, additional: e.target.value })
                      }
                      className="w-full rounded border p-1 text-sm"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => {
                          onUpdate(t.id, editForm);
                          setEditingId(null);
                        }}
                        className="text-brand cursor-pointer"
                      >
                        <FontAwesomeIcon icon={faCheck} />
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="cursor-pointer text-rose-600"
                      >
                        <FontAwesomeIcon icon={faTimes} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="group">
                    <div className="flex items-center gap-3">
                      <span className="text-brand font-mono text-xs font-bold tracking-widest uppercase">
                        {start.toLocaleDateString()} |{" "}
                        {start.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}{" "}
                        -{" "}
                        {end.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                      {isActive && (
                        <span className="bg-brand/10 text-brand animate-pulse rounded-full px-2 py-0.5 text-[10px] font-bold">
                          LIVE NOW
                        </span>
                      )}
                    </div>
                    <h4 className="font-heading text-text mt-1 text-2xl font-semibold">
                      {t.name}
                    </h4>
                    <p className="text-text-soft mt-1 max-w-lg text-sm">
                      {t.additional}
                    </p>

                    {canManage && (
                      <div className="mt-3 flex gap-3 opacity-0 transition group-hover:opacity-100">
                        <button
                          onClick={() => startEdit(t)}
                          className="text-text-soft hover:text-brand cursor-pointer"
                        >
                          <FontAwesomeIcon icon={faEdit} />
                        </button>
                        <button
                          onClick={() => onDelete(t.id)}
                          className="text-text-soft cursor-pointer hover:text-rose-600"
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
}
