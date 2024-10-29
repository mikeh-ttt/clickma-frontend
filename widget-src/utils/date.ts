const formatOption = {
  month: 'short',
  day: '2-digit',
  year: 'numeric',
} as const;
export function formatTimestampToDate(timestamp: number | string) {
  const date = new Date(Number(timestamp));
  return date.toLocaleDateString('en-US', formatOption);
}

export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    ...formatOption,
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

export function formatDuration(ms: number) {
  const seconds = ms / 1000;
  const minutes = seconds / 60;
  const hours = minutes / 60;
  const days = hours / 24;

  if (days >= 1) {
    return `${Math.floor(days)} day(s)`;
  } else if (hours >= 1) {
    return `${Math.floor(hours)} hour(s)`;
  } else if (minutes >= 1) {
    return `${Math.floor(minutes)} minute(s)`;
  } else {
    return `${Math.floor(seconds)} second(s)`;
  }
}
