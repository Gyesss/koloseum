import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faCalendarPlus,
  faImage,
  faLocationDot,
  faPalette,
} from "@fortawesome/free-solid-svg-icons";

import { createEvent } from "../../api/events";
import { createEventBanner } from "../../api/media";

const INITIAL_FORM = {
  name: "",
  tagline: "",
  description: "",
  location: "",
  startAt: "",
  endAt: "",
  mood: "#FF0000",
};

export default function CreateEvent() {
  const navigate = useNavigate();

  const [form, setForm] = useState(INITIAL_FORM);

  const [banner, setBanner] = useState(null);

  const [loading, setLoading] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleBannerChange(event) {
    const file = event.target.files?.[0];

    if (!file) return;

    setBanner(file);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setLoading(true);

      if (!form.startAt || !form.endAt) {
        alert("Start and end date are required");

        return;
      }

      const payload = {
        ...form,

        startAt: new Date(form.startAt).toISOString(),

        endAt: new Date(form.endAt).toISOString(),
      };

      const response = await createEvent(payload);

      const createdEvent = response.data;

      if (!createdEvent?.id) {
        throw new Error("Event creation failed");
      }

      if (banner) {
        try {
          const formData = new FormData();

          formData.append("media", banner);

          await createEventBanner(createdEvent.id, formData);
        } catch (bannerError) {
          console.error("Banner upload failed:", bannerError);
        }
      }

      navigate(`/events/${createdEvent.id}`);
    } catch (error) {
      console.error("Create event failed:", error);

      console.error("Backend response:", error?.response?.data);

      alert(error?.response?.data?.message || "Failed to create event");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-background min-h-dvh px-4 py-8 pb-28 sm:px-6 md:pb-8 md:pl-28 lg:px-10 lg:pl-32">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
        {/* Header */}
        <div>
          <p className="text-brand mb-2 text-sm font-semibold tracking-[0.3em] uppercase">
            Events
          </p>

          <h1 className="font-heading text-text text-4xl font-semibold tracking-tight">
            Create Event
          </h1>

          <p className="text-text-soft mt-3 max-w-2xl leading-7">
            Build a new experience for your audience. Configure the schedule,
            atmosphere, and identity of your event.
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-surface border-border rounded-card flex flex-col gap-8 border p-6 sm:p-8"
        >
          {/* Basic */}
          <section className="grid gap-6">
            <div>
              <label className="text-text mb-2 block text-sm font-medium">
                Event Name
              </label>

              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                minLength={3}
                maxLength={124}
                placeholder="Koloseum"
                className="bg-background border-border rounded-base text-text focus:border-brand w-full border px-4 py-3 transition outline-none"
              />
            </div>

            <div>
              <label className="text-text mb-2 block text-sm font-medium">
                Tagline
              </label>

              <input
                type="text"
                name="tagline"
                value={form.tagline}
                onChange={handleChange}
                required
                minLength={3}
                maxLength={64}
                placeholder="Veni, vidi, vici"
                className="bg-background border-border rounded-base text-text focus:border-brand w-full border px-4 py-3 transition outline-none"
              />
            </div>

            <div>
              <label className="text-text mb-2 block text-sm font-medium">
                Description
              </label>

              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                required
                minLength={10}
                rows={6}
                placeholder="Describe your event..."
                className="bg-background border-border rounded-base text-text focus:border-brand w-full resize-none border px-4 py-3 transition outline-none"
              />
            </div>
          </section>

          {/* Meta */}
          <section className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="text-text mb-2 flex items-center gap-2 text-sm font-medium">
                <FontAwesomeIcon icon={faLocationDot} />
                Location
              </label>

              <input
                type="text"
                name="location"
                value={form.location}
                onChange={handleChange}
                required
                minLength={3}
                placeholder="Indonesia"
                className="bg-background border-border rounded-base text-text focus:border-brand w-full border px-4 py-3 transition outline-none"
              />
            </div>

            <div>
              <label className="text-text mb-2 flex items-center gap-2 text-sm font-medium">
                <FontAwesomeIcon icon={faPalette} />
                Mood Color
              </label>

              <div className="flex items-center gap-3">
                <input
                  type="color"
                  name="mood"
                  value={form.mood}
                  onChange={handleChange}
                  className="border-border h-12 w-16 cursor-pointer rounded border bg-transparent"
                />

                <input
                  type="text"
                  name="mood"
                  value={form.mood}
                  onChange={handleChange}
                  minLength={7}
                  maxLength={7}
                  className="bg-background border-border rounded-base text-text focus:border-brand flex-1 border px-4 py-3 transition outline-none"
                />
              </div>
            </div>
          </section>

          {/* Schedule */}
          <section className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="text-text mb-2 flex items-center gap-2 text-sm font-medium">
                <FontAwesomeIcon icon={faCalendarPlus} />
                Start At
              </label>

              <input
                type="datetime-local"
                name="startAt"
                value={form.startAt}
                onChange={handleChange}
                required
                className="bg-background border-border rounded-base text-text focus:border-brand w-full border px-4 py-3 transition outline-none"
              />
            </div>

            <div>
              <label className="text-text mb-2 flex items-center gap-2 text-sm font-medium">
                <FontAwesomeIcon icon={faCalendarPlus} />
                End At
              </label>

              <input
                type="datetime-local"
                name="endAt"
                value={form.endAt}
                min={form.startAt}
                onChange={handleChange}
                required
                className="bg-background border-border rounded-base text-text focus:border-brand w-full border px-4 py-3 transition outline-none"
              />
            </div>
          </section>

          {/* Banner */}
          <section>
            <label className="text-text mb-2 flex items-center gap-2 text-sm font-medium">
              <FontAwesomeIcon icon={faImage} />
              Event Banner
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={handleBannerChange}
              className="bg-background border-border rounded-base text-text file:bg-brand w-full border px-4 py-3 file:mr-4 file:rounded-md file:border-0 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white"
            />

            <p className="text-text-soft mt-2 text-sm">
              Uploaded using the dedicated media endpoint.
            </p>
          </section>

          {/* Preview */}
          <section
            className="rounded-card relative overflow-hidden border border-white/10"
            style={{
              backgroundColor: form.mood,
            }}
          >
            {banner && (
              <div className="absolute inset-0">
                <img
                  src={URL.createObjectURL(banner)}
                  alt="Preview"
                  className="h-full w-full object-cover opacity-25"
                />

                <div className="absolute inset-0 bg-linear-to-br from-black/65 via-black/45 to-black/75" />
              </div>
            )}

            {!banner && (
              <div className="absolute inset-0 bg-linear-to-br from-black/55 via-black/35 to-black/70" />
            )}

            <div className="relative z-10 flex flex-col gap-4 p-8">
              <div className="inline-flex w-fit items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-semibold tracking-[0.2em] text-white uppercase backdrop-blur-sm">
                Preview
              </div>

              <h2 className="font-heading text-4xl font-semibold text-white">
                {form.name || "Event Name"}
              </h2>

              <p className="text-lg text-white/80">
                {form.tagline || "Your event tagline"}
              </p>

              <p className="max-w-2xl leading-7 text-white/70">
                {form.description ||
                  "Your event description preview will appear here."}
              </p>
            </div>
          </section>

          {/* Actions */}
          <div className="flex flex-wrap items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate("/events")}
              className="border-border rounded-base border px-5 py-3 text-sm font-medium transition hover:bg-white/5"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="bg-brand rounded-base px-5 py-3 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Creating..." : "Create Event"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
