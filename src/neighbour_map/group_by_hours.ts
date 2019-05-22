import { StopWithString as Stop } from "../types";
import { writeFileSync } from "fs";
import { join } from "path";
import { getTimestampId, getTime } from "./utils";

const stops = require("../../stops_date_string.json") as Stop[];

const GROUP_BY_FILE_NAME = join(__dirname, "../../stops_by_hour.json");
const TIMESTAMP_DATE_FILE_NAME = join(
  __dirname,
  "../../stops_date_number.json"
);

remapStopDate()

function remapStopDate() {
  const length = stops.length;
  const groupedByHour: Record<string, Stop[]> = {};
  const stopsWithTimestamp: Stop[] = [];

  for (let i = 0; i < length; i++) {
    console.log(`stops_by_date: ${i}/${length}`);

    const departure = getTime(stops[i].departure as any);
    const timestampId = getTimestampId(departure);

    (stops[i] as any).arrivalHuman = stops[i].arrival;
    (stops[i] as any).departureHuman = stops[i].departure;

    stops[i].arrival = getTime(stops[i].arrival).valueOf() as any;
    stops[i].departure = departure.valueOf() as any;

    stopsWithTimestamp.push(stops[i]);

    if (!groupedByHour[timestampId]) {
      groupedByHour[timestampId] = [];
    }

    groupedByHour[timestampId].push(stops[i]);
  }

  writeFileSync(GROUP_BY_FILE_NAME, JSON.stringify(groupedByHour, null, 2));
  writeFileSync(
    TIMESTAMP_DATE_FILE_NAME,
    JSON.stringify(stopsWithTimestamp, null, 2)
  );
}
