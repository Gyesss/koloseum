import clsx from "clsx";

import { getPostTheme } from "./postUtils";

export default function PostBadge({ type, children }) {
  const theme = getPostTheme(type);

  return (
    <span
      className={clsx(
        "inline-flex items-center border px-2.5 py-1 text-[10px] font-semibold tracking-[0.18em] uppercase",

        theme.badge,
      )}
    >
      {children}
    </span>
  );
}
