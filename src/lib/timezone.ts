import { toZonedTime, fromZonedTime } from 'date-fns-tz';

/**
 * Convert a date from UTC to the client's local timezone for display
 * @param utcDate - The UTC date (from database)
 * @param timezone - The client's timezone (e.g., 'America/Lima')
 * @returns Date in the client's timezone
 */
export const convertUtcToClientTimezone = (utcDate: Date, timezone: string): Date => {
  return toZonedTime(utcDate, timezone);
};

/**
 * Convert a date from the client's local timezone to UTC for storage
 * @param clientDate - The date in the client's timezone
 * @param timezone - The client's timezone (e.g., 'America/Lima')
 * @returns Date in UTC
 */
export const convertClientTimezoneToUtc = (clientDate: Date, timezone: string): Date => {
  return fromZonedTime(clientDate, timezone);
};

/**
 * Combine date and time strings in client timezone and convert to UTC
 * @param dateString - Date string (YYYY-MM-DD)
 * @param timeString - Time string (HH:MM or HH:MM:SS)
 * @param timezone - The client's timezone (e.g., 'America/Lima')
 * @returns UTC Date object
 */
export const combineDateTimeToUtc = (
  dateString: string,
  timeString: string,
  timezone: string
): Date => {
  // Create a date string in the format: YYYY-MM-DDTHH:MM:SS
  const combinedString = `${dateString}T${timeString}`;
  const clientDate = new Date(combinedString);
  
  // Convert from client timezone to UTC
  return fromZonedTime(clientDate, timezone);
};

/**
 * Split a UTC datetime into separate date and time strings in client timezone
 * @param utcDate - The UTC date (from database)
 * @param timezone - The client's timezone (e.g., 'America/Lima')
 * @returns Object with date and time strings
 */
export const splitUtcToDateTimeStrings = (
  utcDate: Date,
  timezone: string
): { date: string; time: string } => {
  const clientDate = toZonedTime(utcDate, timezone);
  
  const year = clientDate.getFullYear();
  const month = String(clientDate.getMonth() + 1).padStart(2, '0');
  const day = String(clientDate.getDate()).padStart(2, '0');
  
  const hours = String(clientDate.getHours()).padStart(2, '0');
  const minutes = String(clientDate.getMinutes()).padStart(2, '0');
  
  return {
    date: `${year}-${month}-${day}`,
    time: `${hours}:${minutes}`
  };
};
