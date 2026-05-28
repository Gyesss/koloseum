export default function getDaysAgo(date) {
  const now = new Date();
  const end = new Date(date);

  const diff = now - end;

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days <= 0) return "Today";

  if (days === 1) return "1 day ago";

  return `${days} days ago`;
}
