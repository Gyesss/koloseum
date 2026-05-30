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
      className={clsx("group relative h-fit cursor-pointer", className)}
    >
      {featured && (
        <>
          <div
            className={clsx(
              "rounded-card border-border/40 bg-surface/80 absolute inset-0 translate-x-2 translate-y-2 border",
              theme.glow,
            )}
          />
          <div className="rounded-card border-border/30 bg-surface/50 absolute inset-0 translate-x-1 translate-y-1 border" />
        </>
      )}

      <div
        className={clsx(
          "rounded-card border-border bg-surface relative overflow-hidden border p-5",
          "transition-all duration-300",
          "hover:-translate-y-1",
          featured
            ? "shadow-[0_25px_60px_rgba(68,64,60,0.15)]"
            : "shadow-[0_15px_35px_rgba(68,64,60,0.08)]",
          theme.glow,
        )}
      >
        <div className="pointer-events-none absolute inset-0 opacity-[0.04]">
          <div
            className="h-full w-full"
            style={{
              backgroundImage:
                "radial-gradient(circle, var(--color-text) 0.8px, transparent 0.8px)",
              backgroundSize: "10px 10px",
            }}
          />
        </div>

        {featured && (
          <div className="mb-3 flex justify-end">
            <div className="rounded-base border-border/30 bg-text border px-2.5 py-0.5">
              <span className="text-surface font-body text-[10px] font-bold tracking-[0.25em] uppercase">
                Featured
              </span>
            </div>
          </div>
        )}

        <div className="relative z-10">{children}</div>
      </div>
    </article>
  );
}
