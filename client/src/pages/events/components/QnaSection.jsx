import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faTrash,
  faEdit,
  faCheck,
  faTimes,
  faQuestionCircle,
} from "@fortawesome/free-solid-svg-icons";

export default function QnaSection({
  qnas,
  canManage,
  onCreate,
  onUpdate,
  onDelete,
}) {
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  const startEdit = (qna) => {
    setEditingId(qna.id);
    setEditForm({
      question: qna.question || "",
      answer: qna.answer || "",
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

  return (
    <div className="font-body space-y-10">
      {canManage && (
        <div className="border-border bg-surface rounded-card space-y-5 border p-8 shadow-sm">
          <h3 className="font-heading text-text text-3xl font-semibold">
            Add New Q&A
          </h3>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              onCreate(Object.fromEntries(formData));
              e.target.reset();
            }}
            className="space-y-4"
          >
            <input
              name="question"
              placeholder="Question"
              required
              className="border-border bg-background text-text rounded-base focus:border-brand w-full border px-4 py-3 text-sm font-medium transition outline-none"
            />
            <textarea
              name="answer"
              placeholder="Answer"
              required
              className="border-border bg-background text-text rounded-base focus:border-brand w-full resize-none border p-4 text-sm font-medium transition outline-none"
            />
            <button
              type="submit"
              className="rounded-base bg-brand cursor-pointer px-6 py-3 text-xs font-bold tracking-widest text-white uppercase transition hover:opacity-90"
            >
              <FontAwesomeIcon icon={faPlus} className="mr-2" /> Add Q&A
            </button>
          </form>
        </div>
      )}

      {qnas.length > 0 && (
        <div className="relative ml-4 md:ml-4">
          <div className="bg-border absolute top-4 bottom-4 left-3.75 w-0.5" />
          <div className="space-y-12">
            {qnas.map((q) => (
              <div key={q.id} className="relative flex gap-8">
                <div className="border-background bg-brand/10 text-brand absolute left-0 flex h-8 w-8 items-center justify-center rounded-full border-2 shadow-sm">
                  <FontAwesomeIcon icon={faQuestionCircle} size="sm" />
                </div>

                <div className="w-full pl-12">
                  {editingId === q.id ? (
                    <div className="bg-surface rounded-card border-border space-y-4 border p-6">
                      <input
                        value={editForm.question}
                        onChange={(e) =>
                          setEditForm({ ...editForm, question: e.target.value })
                        }
                        placeholder="Question"
                        className="border-border bg-background text-text rounded-base focus:border-brand w-full border px-4 py-3 text-sm font-medium outline-none"
                      />
                      <textarea
                        value={editForm.answer}
                        onChange={(e) =>
                          setEditForm({ ...editForm, answer: e.target.value })
                        }
                        placeholder="Answer"
                        className="border-border bg-background text-text rounded-base focus:border-brand w-full resize-none border p-3 text-sm outline-none"
                      />
                      <div className="flex justify-end gap-3">
                        <button
                          onClick={() => handleUpdate(q.id, editForm)}
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
                      <h4 className="font-heading text-text text-3xl font-semibold">
                        {q.question}
                      </h4>
                      <p className="text-text-soft mt-1 max-w-xl text-sm leading-relaxed">
                        {q.answer}
                      </p>
                      {canManage && (
                        <div className="mt-3 flex gap-4 opacity-0 transition group-hover:opacity-100">
                          <button
                            onClick={() => startEdit(q)}
                            className="text-text-soft hover:text-brand text-sm"
                          >
                            <FontAwesomeIcon icon={faEdit} className="mr-1" />{" "}
                            Edit
                          </button>
                          <button
                            onClick={() => onDelete(q.id)}
                            className="text-text-soft text-sm hover:text-red-600"
                          >
                            <FontAwesomeIcon icon={faTrash} className="mr-1" />{" "}
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
