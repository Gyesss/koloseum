import clsx from "clsx";

const tabs = [
  { key: "timeline", label: "Timeline" },
  { key: "qna", label: "Q&A" },
  { key: "posts", label: "Posts" },
];

export default function EventTabs({ activeTab, setActiveTab }) {
  return (
    <div className="border-border bg-surface rounded-card flex flex-wrap gap-2 border p-2">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => setActiveTab(tab.key)}
          className={clsx(
            "rounded-base px-4 py-2 text-sm font-medium transition",
            activeTab === tab.key
              ? "bg-brand text-white"
              : "text-text hover:bg-brand/10",
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
