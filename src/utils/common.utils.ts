import { format } from 'date-fns';

export const filterSearchQuery = (query: string) => {
  return query
    .replace(/[^\w\s]/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
};

export const capitalizeFirstLetter = (val: string) => {
  return val.charAt(0).toUpperCase() + val.slice(1);
};

export const formatDateString = (date: Date | string): string => {
  try {
    const parsedDate = new Date(date);

    // Check if date is valid
    if (isNaN(parsedDate.getTime())) {
      throw new Error('Invalid date');
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return format(parsedDate, 'MMMM dd, yyyy');
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Invalid date format';
    throw new Error(errorMessage);
  }
};
