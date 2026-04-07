function normalizeDate(value) {
  const date =
    value instanceof Date
      ? new Date(value)
      : new Date(typeof value === 'string' && value.includes('T') ? value : `${value}T00:00:00`);
  date.setHours(0, 0, 0, 0);
  return date;
}

export function buildInclusiveDateRange(startDate, endDate) {
  if (!startDate || !endDate) {
    return [];
  }

  const start = normalizeDate(startDate);
  const end = normalizeDate(endDate);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || start > end) {
    return [];
  }

  const dates = [];

  for (const current = new Date(start); current <= end; current.setDate(current.getDate() + 1)) {
    dates.push(new Date(current));
  }

  return dates;
}

export function hasDateConflict(bookedDates, selectedRange) {
  if (selectedRange.length === 0) {
    return false;
  }

  const selectedKeys = new Set(selectedRange.map((date) => normalizeDate(date).toISOString()));
  return bookedDates.some((date) => selectedKeys.has(normalizeDate(date).toISOString()));
}
