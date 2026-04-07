function padDatePart(value) {
  return String(value).padStart(2, '0');
}

function getCalendarDateKey(value) {
  if (typeof value === 'string') {
    const match = value.match(/^(\d{4})-(\d{2})-(\d{2})/);

    if (match) {
      return `${match[1]}-${match[2]}-${match[3]}`;
    }

    return '';
  }

  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return `${value.getFullYear()}-${padDatePart(value.getMonth() + 1)}-${padDatePart(value.getDate())}`;
  }

  return '';
}

function parseCalendarDate(value) {
  const key = getCalendarDateKey(value);

  if (!key) {
    return null;
  }

  const [year, month, day] = key.split('-').map(Number);
  const parsed = new Date(Date.UTC(year, month - 1, day));

  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  return parsed;
}

function formatUtcDateKey(date) {
  return `${date.getUTCFullYear()}-${padDatePart(date.getUTCMonth() + 1)}-${padDatePart(date.getUTCDate())}`;
}

export function buildInclusiveDateRange(startDate, endDate) {
  if (!startDate || !endDate) {
    return [];
  }

  const start = parseCalendarDate(startDate);
  const end = parseCalendarDate(endDate);

  if (!start || !end || start > end) {
    return [];
  }

  const dates = [];

  for (const current = new Date(start); current <= end; current.setUTCDate(current.getUTCDate() + 1)) {
    dates.push(formatUtcDateKey(current));
  }

  return dates;
}

export function hasDateConflict(bookedDates, selectedRange) {
  if (selectedRange.length === 0) {
    return false;
  }

  const selectedKeys = new Set(selectedRange.map(getCalendarDateKey).filter(Boolean));
  return bookedDates.some((date) => selectedKeys.has(getCalendarDateKey(date)));
}
