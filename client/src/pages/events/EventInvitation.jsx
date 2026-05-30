import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faPaperPlane,
  faPhone,
} from "@fortawesome/free-solid-svg-icons";

import { invite } from "../../api/invitation";

const INITIAL_FORM = {
  content: "",
  phones: "",
};

export default function EventInvitation() {
  const navigate = useNavigate();
  const { eventId } = useParams();
  const [form, setForm] = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setLoading(true);

      const rawPhones = form.phones
        .split("\n")
        .map((phone) => phone.replace(/\D/g, ""))
        .filter(Boolean);

      if (!rawPhones.length) {
        alert("Phone numbers are required");
        return;
      }

      const invalidPhones = rawPhones.filter((phone) => phone.startsWith("0"));

      if (invalidPhones.length > 0) {
        alert("Phone numbers must not start with 0. Use country code format.");
        return;
      }

      const payload = {
        eventId,
        phones: rawPhones,
        content: form.content,
      };

      await invite(payload);

      alert("Invitations sent successfully");
      navigate(`/events/${eventId}`);
    } catch (error) {
      console.error("Invitation failed:", error);
      console.error("Backend response:", error?.response?.data);

      alert(error?.response?.data?.message || "Failed to send invitations");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-background min-h-dvh px-4 py-8 pb-28 sm:px-6 md:pb-8 md:pl-28 lg:px-10 lg:pl-32">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-8">
        {/* HEADER */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="w-full">
            <div className="text-brand mb-3 inline-flex items-center gap-2 text-sm font-semibold tracking-[0.3em] uppercase">
              <FontAwesomeIcon icon={faEnvelope} />
              <span>Invitations</span>
            </div>

            <h1 className="font-heading text-text text-4xl font-semibold tracking-tight sm:text-5xl">
              Invite Guests
            </h1>

            <p className="text-text-soft mt-4 w-full text-base leading-7">
              Send invitations directly to your guests using phone numbers.
            </p>
          </div>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-surface border-border rounded-card flex flex-col gap-8 border p-6 sm:p-8"
        >
          {/* Phones */}
          <section className="grid gap-3">
            <label className="text-text flex items-center gap-2 text-sm font-medium">
              <FontAwesomeIcon icon={faPhone} />
              Phone Numbers
            </label>

            <textarea
              name="phones"
              value={form.phones}
              onChange={handleChange}
              required
              rows={8}
              placeholder={`62123456789\n62987654321\n62192837465`}
              className="bg-background border-border rounded-base text-text focus:border-brand w-full resize-none border px-4 py-3 font-mono outline-none"
            />

            <p className="text-text-soft text-sm">One phone number per line.</p>
          </section>

          {/* Content */}
          <section className="grid gap-3">
            <label className="text-text flex items-center gap-2 text-sm font-medium">
              <FontAwesomeIcon icon={faEnvelope} />
              Invitation Message
            </label>

            <textarea
              name="content"
              value={form.content}
              onChange={handleChange}
              required
              minLength={10}
              rows={6}
              placeholder="We invite you to attend our event"
              className="bg-background border-border rounded-base text-text focus:border-brand w-full resize-none border px-4 py-3 outline-none"
            />
          </section>

          {/* Preview */}
          <section className="bg-background border-border rounded-card flex flex-col gap-4 border p-6">
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faPaperPlane} className="text-brand" />

              <h2 className="text-text text-lg font-semibold">
                Message Preview
              </h2>
            </div>

            <div className="rounded-2xl bg-[#202c33] p-4 text-sm text-white shadow-lg">
              <div className="rounded-2xl bg-[#005c4b] p-4 leading-7 whitespace-pre-wrap">
                {form.content ||
                  "Your invitation message preview appears here."}
              </div>
            </div>
          </section>

          {/* Actions */}
          <div className="flex flex-wrap items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate(`/events/${eventId}`)}
              className="border-border rounded-base border px-5 py-3 text-sm font-medium transition hover:bg-white/5"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="bg-brand rounded-base px-5 py-3 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Sending..." : "Send Invitations"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
