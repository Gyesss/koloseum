import { faChartSimple } from "@fortawesome/free-solid-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function PostPollTeaser({ poll }) {
  if (!poll) return null;

  return (
    <div className="mt-4 flex items-center justify-between border border-black/10 bg-black/3 px-3 py-2">
      <div className="flex items-center gap-2">
        <FontAwesomeIcon
          icon={faChartSimple}
          className="text-xs text-stone-700"
        />

        <span className="text-xs font-medium text-stone-800">
          Community Poll
        </span>
      </div>

      <div className="text-[11px] text-stone-500">
        {poll.options.length} options
      </div>
    </div>
  );
}
