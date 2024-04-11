export function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  if (hours === 0 && remainingSeconds < 10) {
    return `${minutes}:0${remainingSeconds}`;
  }

  if (hours === 0) {
    return `${minutes}:${remainingSeconds}`;
  }
  if (remainingSeconds < 10) {
    return `${hours}:${minutes}:0${remainingSeconds}`;
  }
  if (minutes < 10) {
    return `${hours}:0${minutes}:${remainingSeconds}`;
  }
  return `${hours}:${minutes}:${remainingSeconds}`;
}