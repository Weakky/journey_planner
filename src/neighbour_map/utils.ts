export function getTimestampId(departure: Date) {
  return `${departure.getFullYear()}-${departure.getMonth()}-${departure.getDate()}-${departure.getHours()}`;
}

export function getTime(dateString: string) {
  const [date, time] = dateString.split(" ");
  const [year, month, day] = date.split("-");
  const [hours, minutes, seconds] = time.split(":");

  return new Date(
    parseInt(year, 10),
    parseInt(month, 10),
    parseInt(day, 10),
    parseInt(hours, 10),
    parseInt(minutes, 10),
    parseInt(seconds, 10)
  );
}
