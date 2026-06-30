// Time formatting utilities using date-fns
import { formatDistanceToNow, format, differenceInSeconds } from 'date-fns';

export const formatRelativeTime = (timestamp) => {
  if (!timestamp) return 'Unknown';

  const date = new Date(timestamp);
  const secondsAgo = differenceInSeconds(new Date(), date);

  if (secondsAgo < 10) return 'Just now';
  if (secondsAgo < 60) return `${secondsAgo}s ago`;

  return formatDistanceToNow(date, { addSuffix: true });
};

export const formatDateTime = (timestamp) => {
  if (!timestamp) return 'N/A';
  return format(new Date(timestamp), 'MMM d, yyyy, h:mm a');
};

export const isLocationStale = (timestamp, thresholdSeconds = 15) => {
  if (!timestamp) return true;
  const secondsAgo = differenceInSeconds(new Date(), new Date(timestamp));
  return secondsAgo > thresholdSeconds;
};
