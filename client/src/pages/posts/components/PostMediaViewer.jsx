import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faXmark,
  faChevronLeft,
  faChevronRight,
  faPlay,
} from "@fortawesome/free-solid-svg-icons";

const isVideo = (m) => m.mimeType?.startsWith("video/");

function getGridClass(count) {
  if (count === 1) return "grid-cols-1";
  if (count === 2) return "grid-cols-2";
  if (count === 3) return "grid-cols-3";
  return "grid-cols-2"; // 4
}

export default function PostMediaViewer({ media }) {
  const [lightboxIndex, setLightboxIndex] = useState(null);

  if (!media || media.length === 0) return null;

  const MAX_VISIBLE = 4;
  const visibleMedia = media.slice(0, MAX_VISIBLE);
  const remaining = media.length - MAX_VISIBLE;
  const gridClass = getGridClass(visibleMedia.length);

  const closeLightbox = () => setLightboxIndex(null);
  const prev = () =>
    setLightboxIndex((i) => (i - 1 + media.length) % media.length);
  const next = () => setLightboxIndex((i) => (i + 1) % media.length);

  return (
    <>
      <div className={`bg-border/10 grid gap-0.5 ${gridClass}`}>
        {visibleMedia.map((m, idx) => {
          const isLast = idx === MAX_VISIBLE - 1 && remaining > 0;
          return (
            <div
              key={idx}
              onClick={() => setLightboxIndex(idx)}
              className="bg-border/20 group relative cursor-zoom-in overflow-hidden"
              style={{ aspectRatio: media.length === 1 ? "16/9" : "1/1" }}
            >
              {isVideo(m) ? (
                <>
                  <video
                    src={m.url}
                    className="h-full w-full object-cover"
                    muted
                    playsInline
                  />
                  <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/25">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white">
                      <FontAwesomeIcon
                        icon={faPlay}
                        className="ml-0.5 text-xs"
                      />
                    </div>
                  </div>
                </>
              ) : (
                <img
                  src={m.url}
                  alt={m.name || `media-${idx}`}
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                />
              )}
              <div className="absolute inset-0 bg-black/0 transition group-hover:bg-black/10" />

              {isLast && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-[1px]">
                  <span className="text-3xl font-bold text-white">
                    +{remaining}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/92 p-4"
          onClick={closeLightbox}
        >
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white/80 transition hover:bg-white/20 hover:text-white"
          >
            <FontAwesomeIcon icon={faXmark} />
          </button>

          <div className="absolute top-4 left-1/2 -translate-x-1/2 rounded-full bg-black/40 px-3 py-1 text-xs font-medium text-white/70 backdrop-blur-sm">
            {lightboxIndex + 1} / {media.length}
          </div>

          {media.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prev();
                }}
                className="absolute top-1/2 left-4 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white/80 transition hover:bg-white/20 hover:text-white"
              >
                <FontAwesomeIcon icon={faChevronLeft} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  next();
                }}
                className="absolute top-1/2 right-4 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white/80 transition hover:bg-white/20 hover:text-white"
              >
                <FontAwesomeIcon icon={faChevronRight} />
              </button>
            </>
          )}

          <div
            className="flex max-h-[85vh] w-full max-w-5xl items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {isVideo(media[lightboxIndex]) ? (
              <video
                src={media[lightboxIndex].url}
                controls
                autoPlay
                className="max-h-[85vh] max-w-full rounded-sm shadow-2xl"
              />
            ) : (
              <img
                src={media[lightboxIndex].url}
                alt={media[lightboxIndex].name}
                className="max-h-[85vh] max-w-full rounded-sm object-contain shadow-2xl"
              />
            )}
          </div>

          {media.length <= 8 ? (
            <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1.5">
              {media.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => {
                    e.stopPropagation();
                    setLightboxIndex(i);
                  }}
                  className={`h-1.5 cursor-pointer rounded-full transition-all ${
                    i === lightboxIndex
                      ? "w-4 bg-white"
                      : "w-1.5 bg-white/35 hover:bg-white/60"
                  }`}
                />
              ))}
            </div>
          ) : (
            <div
              className="absolute right-0 bottom-0 left-0 flex gap-1.5 overflow-x-auto bg-black/60 p-3 backdrop-blur-sm"
              onClick={(e) => e.stopPropagation()}
            >
              {media.map((m, i) => (
                <button
                  key={i}
                  onClick={() => setLightboxIndex(i)}
                  className={`h-14 w-14 shrink-0 cursor-pointer overflow-hidden rounded-sm transition ${
                    i === lightboxIndex
                      ? "ring-2 ring-white ring-offset-1 ring-offset-black"
                      : "opacity-50 hover:opacity-100"
                  }`}
                >
                  {isVideo(m) ? (
                    <div className="flex h-full w-full items-center justify-center bg-black/50">
                      <FontAwesomeIcon
                        icon={faPlay}
                        className="text-xs text-white"
                      />
                    </div>
                  ) : (
                    <img
                      src={m.url}
                      alt={`thumb-${i}`}
                      className="h-full w-full object-cover"
                    />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
