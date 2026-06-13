import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faCamera,
  faFloppyDisk,
  faLock,
  faShieldHalved,
  faGear,
  faEye,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";

import useAuth from "../../hooks/useAuth";
import { updateProfile } from "../../api/profile";
import { createUserAvatar, createUserBanner } from "../../api/media";

const parseBirthDay = (value) => {
  if (!value) return "";
  const date = new Date(value);
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export default function EditProfile() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const original = {
    username: user?.username || "",
    fullName: user?.fullName || "",
    bio: user?.bio || "",
    phone: user?.phone || "",
    address: user?.address || "",
    gender: user?.gender || "",
    birthDay: parseBirthDay(user?.birthDay),
  };

  const [form, setForm] = useState(original);

  const [avatarPreview, setAvatarPreview] = useState(user?.avatarUrl || "");
  const [bannerPreview, setBannerPreview] = useState(user?.bannerUrl || "");

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAvatarPreview(URL.createObjectURL(file));

    const formData = new FormData();
    formData.append("media", file);

    try {
      await createUserAvatar(formData);
    } catch (err) {
      console.error(err);
    }
  };

  const handleBannerChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setBannerPreview(URL.createObjectURL(file));

    const formData = new FormData();
    formData.append("media", file);

    try {
      await createUserBanner(formData);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const payload = Object.fromEntries(
        Object.entries(form).filter(([key, value]) => value !== original[key]),
      );

      if (Object.keys(payload).length === 0) {
        navigate("/profile");
        return;
      }

      // Convert empty string to null so backend can clear the field
      if ("gender" in payload) {
        payload.gender = payload.gender === "" ? null : payload.gender;
      }

      if ("birthDay" in payload) {
        payload.birthDay = payload.birthDay === "" ? null : payload.birthDay;
      }

      await updateProfile(payload);

      navigate("/profile");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const initials = user?.fullName
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="bg-background min-h-dvh px-6 py-10 md:px-10">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        {/* HEADER */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-brand mb-3 inline-flex items-center gap-2 text-sm font-semibold tracking-[0.3em] uppercase">
              <FontAwesomeIcon icon={faGear} />
              <span>Profile Settings</span>
            </div>

            <h1 className="font-heading text-text text-4xl font-semibold tracking-tight sm:text-5xl">
              Edit Profile
            </h1>

            <p className="text-text-soft mt-4 max-w-2xl text-base leading-7">
              Update your personal details, contact information, and customize
              your profile appearance.
            </p>
          </div>

          <Link
            to="/profile"
            className="bg-surface border-border text-text rounded-base hover:bg-brand/5 inline-flex items-center justify-center gap-2 self-start border px-5 py-3 text-sm font-medium transition sm:self-auto"
          >
            <FontAwesomeIcon icon={faArrowLeft} />
            Back
          </Link>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="bg-surface border-border rounded-card overflow-hidden border shadow-sm">
            {/* Top Accent */}
            <div className="from-border via-brand to-accent h-2 w-full bg-linear-to-r" />

            {/* Banner */}
            <div className="relative h-52 w-full md:h-72">
              {bannerPreview ? (
                <img
                  src={bannerPreview}
                  alt="Banner"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="bg-surface h-full w-full" />
              )}

              <label className="bg-background/90 text-text rounded-base hover:bg-background absolute top-4 right-4 inline-flex cursor-pointer items-center gap-2 px-4 py-2 text-sm font-medium shadow-sm backdrop-blur transition">
                <FontAwesomeIcon icon={faCamera} />
                Change Banner
                <input
                  type="file"
                  accept="image/jpeg, image/png, image/webp"
                  className="hidden"
                  onChange={handleBannerChange}
                />
              </label>

              {/* Avatar */}
              <div className="absolute bottom-0 left-6 translate-y-1/2">
                <div className="relative">
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt={user?.fullName}
                      className="border-background h-28 w-28 rounded-full border-4 object-cover shadow-sm md:h-32 md:w-32"
                    />
                  ) : (
                    <div className="bg-brand border-background flex h-28 w-28 items-center justify-center rounded-full border-4 text-3xl font-semibold text-white shadow-sm md:h-32 md:w-32">
                      {initials}
                    </div>
                  )}

                  <label className="bg-brand absolute right-1 bottom-1 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-white shadow-sm transition hover:opacity-90">
                    <FontAwesomeIcon icon={faCamera} />
                    <input
                      type="file"
                      accept="image/jpeg, image/png, image/webp"
                      className="hidden"
                      onChange={handleAvatarChange}
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="px-6 pt-20 pb-8 md:px-8">
              <div className="grid gap-5 md:grid-cols-2">
                <Input
                  label="Username"
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  required
                />

                {/* Email — read-only */}
                <div className="flex flex-col gap-2">
                  <label className="text-text text-sm font-medium">Email</label>
                  <input
                    type="email"
                    value={user?.email || ""}
                    disabled
                    className="bg-surface border-border text-text-soft rounded-base h-12 cursor-not-allowed border px-4 text-sm outline-none"
                  />
                </div>

                <Input
                  label="Full Name"
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  required
                />

                <Input
                  label="Phone"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                />

                <Input
                  label="Address"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                />

                {/* Gender — with clearable default option */}
                <div className="flex flex-col gap-2">
                  <label className="text-text text-sm font-medium">
                    Gender
                  </label>
                  <select
                    name="gender"
                    value={form.gender}
                    onChange={handleChange}
                    className="bg-background border-border text-text rounded-base focus:border-brand h-12 border px-4 text-sm outline-none"
                  >
                    <option value="">Not specified</option>
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                  </select>
                </div>

                <Input
                  label="Birth Day"
                  name="birthDay"
                  type="date"
                  value={form.birthDay}
                  onChange={handleChange}
                />

                {/* Role — read-only display */}
                <div className="flex flex-col gap-2">
                  <label className="text-text text-sm font-medium">Role</label>
                  <div className="bg-surface border-border text-text-soft rounded-base flex h-12 items-center gap-3 border px-4 text-sm">
                    <FontAwesomeIcon icon={faShieldHalved} />
                    {user?.role}
                  </div>
                </div>

                {/* Password — read-only with show/hide toggle */}
                <div className="flex flex-col gap-2 md:col-span-2">
                  <label className="text-text text-sm font-medium">
                    Password
                  </label>
                  <div className="bg-surface border-border rounded-base flex h-12 items-center gap-3 border px-4 text-sm">
                    <FontAwesomeIcon
                      icon={faLock}
                      className="text-text-soft shrink-0"
                    />
                    <span className="text-text-soft flex-1 tracking-widest">
                      {showPassword
                        ? "Your password is managed separately."
                        : "••••••••••••"}
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="text-text-soft hover:text-text transition"
                      aria-label={showPassword ? "Hide" : "Show"}
                    >
                      <FontAwesomeIcon
                        icon={showPassword ? faEyeSlash : faEye}
                      />
                    </button>
                  </div>
                </div>

                {/* Bio */}
                <div className="flex flex-col gap-2 md:col-span-2">
                  <label className="text-text text-sm font-medium">Bio</label>
                  <textarea
                    name="bio"
                    rows={5}
                    value={form.bio}
                    onChange={handleChange}
                    placeholder="Tell something about yourself..."
                    className="bg-background border-border text-text rounded-base focus:border-brand resize-none border px-4 py-3 text-sm outline-none"
                  />
                </div>
              </div>

              {/* Submit */}
              <div className="mt-8 flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-brand rounded-base inline-flex items-center gap-2 px-5 py-3 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <FontAwesomeIcon icon={faFloppyDisk} />
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

function Input({
  label,
  name,
  value,
  onChange,
  type = "text",
  required = false,
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-text text-sm font-medium">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="bg-background border-border text-text rounded-base focus:border-brand h-12 border px-4 text-sm outline-none"
      />
    </div>
  );
}
