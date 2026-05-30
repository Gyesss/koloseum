import { useRef } from "react";
import clsx from "clsx";

import {
  getGridClass,
  getMediaLayout,
  isImageFile,
  isVideoFile,
} from "./postUtils";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay } from "@fortawesome/free-solid-svg-icons";

function MediaItem({ media, className, overlay }) {
  const isImage = isImageFile(media?.mimeType);
  const isVideo = isVideoFile(media?.mimeType);

  const videoRef = useRef(null);

  const handleMouseEnter = () => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  };

  const handleMouseLeave = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <div
      className={clsx("relative overflow-hidden bg-stone-200", className)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {isImage && (
        <img
          src={media.url}
          alt={media.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.015]"
        />
      )}

      {isVideo && (
        <>
          <video
            ref={videoRef}
            src={media.url}
            muted
            playsInline
            className="h-full w-full object-cover"
          />

          <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/20">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white">
              <FontAwesomeIcon icon={faPlay} className="ml-0.5 text-xs" />
            </div>
          </div>
        </>
      )}

      {overlay}
    </div>
  );
}

export default function PostMediaGrid({ media = [] }) {
  if (!media?.length) return null;

  const layout = getMediaLayout(media);

  return (
    <div className="mt-3 bg-stone-300 p-0.5">
      <div className={clsx("grid gap-0.5", getGridClass(layout.type))}>
        {layout.items.map((item, index) => {
          const isSingle = layout.type === "single";
          const isTripleHero = layout.type === "triple" && index === 0;

          const isOverflow =
            layout.type === "quad" && index === 3 && layout.remaining > 0;

          return (
            <MediaItem
              key={`${item.url}-${index}`}
              media={item}
              className={clsx(
                isSingle ? "aspect-4/5" : "aspect-square",
                isTripleHero && "col-span-2 aspect-16/10",
              )}
              overlay={
                isOverflow ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-[1px]">
                    <span className="text-3xl font-bold text-white">
                      +{layout.remaining}
                    </span>
                  </div>
                ) : null
              }
            />
          );
        })}
      </div>
    </div>
  );
}
