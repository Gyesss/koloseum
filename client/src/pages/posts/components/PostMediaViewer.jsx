import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faXmark,
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

export default function PostMediaViewer({ media }) {
  const [lightboxIndex, setLightboxIndex] = useState(null);

  if (!media || media.length === 0) return null;

  const isVideo = (m) => m.mimeType?.startsWith("video/");

  const openLightbox = (index) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);
  const prev = () =>
    setLightboxIndex((i) => (i - 1 + media.length) % media.length);
  const next = () => setLightboxIndex((i) => (i + 1) % media.length);

  const gridClass =
    media.length === 1
      ? "grid-cols-1"
      : media.length === 2
        ? "grid-cols-2"
        : media.length === 3
          ? "grid-cols-3"
          : "grid-cols-2";

  return (
    <>
      <div className={`grid gap-1 ${gridClass}`}>
        {media.map((m, idx) => (
          <div
            key={idx}
            onClick={() => openLightbox(idx)}
            className="bg-border/20 relative cursor-zoom-in overflow-hidden rounded-sm"
            style={{ aspectRatio: media.length === 1 ? "16/9" : "1/1" }}
          >
            {isVideo(m) ? (
              <video src={m.url} className="h-full w-full object-cover" muted />
            ) : (
              <img
                src={m.url}
                alt={m.name || `media-${idx}`}
                className="h-full w-full object-cover transition hover:scale-105"
              />
            )}
            {/* overlay hint */}
            <div className="absolute inset-0 bg-black/0 transition hover:bg-black/10" />
          </div>
        ))}
      </div>

      {/* LIGHTBOX */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={closeLightbox}
        >
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 cursor-pointer text-xl text-white/70 transition hover:text-white"
          >
            <FontAwesomeIcon icon={faXmark} />
          </button>

          {media.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prev();
                }}
                className="absolute top-1/2 left-4 -translate-y-1/2 cursor-pointer p-2 text-xl text-white/70 transition hover:text-white"
              >
                <FontAwesomeIcon icon={faChevronLeft} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  next();
                }}
                className="absolute top-1/2 right-4 -translate-y-1/2 cursor-pointer p-2 text-xl text-white/70 transition hover:text-white"
              >
                <FontAwesomeIcon icon={faChevronRight} />
              </button>
            </>
          )}

          <div
            className="flex max-h-[90vh] w-full max-w-5xl items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {isVideo(media[lightboxIndex]) ? (
              <video
                src={media[lightboxIndex].url}
                controls
                autoPlay
                className="max-h-[90vh] max-w-full rounded-sm"
              />
            ) : (
              <img
                src={media[lightboxIndex].url}
                alt={media[lightboxIndex].name}
                className="max-h-[90vh] max-w-full rounded-sm object-contain"
              />
            )}
          </div>

          {media.length > 1 && (
            <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1.5">
              {media.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => {
                    e.stopPropagation();
                    setLightboxIndex(i);
                  }}
                  className={`h-1.5 cursor-pointer rounded-full transition-all ${
                    i === lightboxIndex ? "w-4 bg-white" : "w-1.5 bg-white/40"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
