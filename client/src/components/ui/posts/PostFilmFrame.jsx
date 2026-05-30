import clsx from "clsx";

import { useNavigate } from "react-router-dom";

import { getPostTheme } from "./postUtils";

export default function PostFilmFrame({
  children,
  postType = "ANNOUNCEMENT",
  featured = false,
  className,
  to,
}) {
  const navigate = useNavigate();

  const theme = getPostTheme(postType);

  return (
    <article
      onClick={() => {
        if (to) navigate(to);
      }}
      className={clsx(
        "group relative h-fit cursor-pointer",

        className,
      )}
    >
      {featured && (
        <>
          <div
            className={clsx(
              "absolute inset-0 translate-x-2 translate-y-2 border border-black/10 bg-[#ece8e1]",

              theme.glow,
            )}
          />

          <div className="absolute inset-0 translate-x-1 translate-y-1 border border-black/10 bg-[#f6f3ee]" />
        </>
      )}

      <div
        className={clsx(
          "relative overflow-hidden border border-black/10 bg-[#f3f1ee] p-4",

          "transition-all duration-300",

          "hover:-translate-y-1",

          featured
            ? "shadow-[0_30px_70px_rgba(0,0,0,0.18)]"
            : "shadow-[0_18px_40px_rgba(0,0,0,0.12)]",

          theme.glow,
        )}
      >
        <div className="pointer-events-none absolute inset-0 opacity-[0.03]">
          <div
            className="h-full w-full"
            style={{
              backgroundImage:
                "radial-gradient(circle, black 0.7px, transparent 0.7px)",
              backgroundSize: "8px 8px",
            }}
          />
        </div>

        {featured && (
          <div className="absolute top-3 right-3 z-20 border border-black/10 bg-black px-2 py-1">
            <span className="text-[10px] tracking-[0.25em] text-white uppercase">
              Featured
            </span>
          </div>
        )}

        <div className="relative z-10">{children}</div>
      </div>
    </article>
  );
}
