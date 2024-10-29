export function formatTimestampToDate(timestamp: number | string) {
  const date = new Date(Number(timestamp));
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  });
}
