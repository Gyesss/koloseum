import { POST_THEMES, DEFAULT_POST_THEME } from "./postThemes";

export function getPostTheme(type) {
  if (!type) return DEFAULT_POST_THEME;

  return POST_THEMES[type] || DEFAULT_POST_THEME;
}

export function getMediaLayout(media = []) {
  const count = media.length;

  if (count <= 1) {
    return {
      type: "single",
      items: media.slice(0, 1),
    };
  }

  if (count === 2) {
    return {
      type: "double",
      items: media.slice(0, 2),
    };
  }

  if (count === 3) {
    return {
      type: "triple",
      items: media.slice(0, 3),
    };
  }

  return {
    type: "quad",
    items: media.slice(0, 4),
    remaining: count - 4,
  };
}

export function isImageFile(mimeType = "") {
  return mimeType.startsWith("image");
}

export function isVideoFile(mimeType = "") {
  return mimeType.startsWith("video");
}

export function getGridClass(type) {
  switch (type) {
    case "single":
      return "grid-cols-1";

    case "double":
      return "grid-cols-2";

    case "triple":
      return "grid-cols-2";

    case "quad":
      return "grid-cols-2";

    default:
      return "grid-cols-2";
  }
}

export function getInitials(name = "") {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function formatCompactDate(date) {
  if (!date) return "";

  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}
