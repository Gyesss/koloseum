export default function getCountdown(date) {
  const now = new Date();
  const target = new Date(date);

  const diff = target - now;

  if (diff <= 0) return "Starting soon";

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);

  if (days > 0) {
    return `${days} day${days > 1 ? "s" : ""} ${hours} hour${hours > 1 ? "s" : ""}`;
  }

  return `${hours} hour${hours > 1 ? "s" : ""}`;
}
