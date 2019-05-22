import { writeFileSync } from 'fs';
import { StopWithNumber as Stop } from '../types';
import { getTimestampId } from './utils';
const stopsByDate = require('../../stops_by_hour.json') as StopByDate;
const stops = require('../../stops_date_number.json') as Stop[];

type StopByDate = Record<string, Stop[]>;

const HOUR = 60 * 60 * 1000;
const TRANSFER_TIME_THRESHOLD = HOUR * 2;

console.time('Compute neighbour map...');
buildNeighbourMap();
console.timeEnd('Compute neighbour map...');

function buildNeighbourMap() {
  const length = stops.length;
  const output: Record<number, number[]> = {};
  let counter = 0;

  for (let i = 0; i < length; i++) {
    counter++;

    if (counter === 20000) {
      console.log(`neighbour_map: ${i}/${length}`);
      counter = 0;
    }
    const cur = stops[i];

    const neighbours = findReachableStops(cur);
    const nLength = neighbours.length;

    if (nLength > 0) {
      if (!output[cur.id]) {
        output[cur.id] = [];
      }

      for (let j = 0; j < nLength; j++) {
        output[cur.id].push(neighbours[j]);
      }
    }
  }

  writeFileSync('neighbour_map.json', JSON.stringify(output, null, 2));
}

function findReachableStops(cur: Stop) {
  const output: number[] = [];
  const curArrivalTime = cur.arrival;
  const reachableStops = getReachableStops(cur);
  const length = reachableStops.length;

  for (let i = 0; i < length; i++) {
    const n = reachableStops[i];
    const neighbourDepartTime = n.departure;
    const threshold = curArrivalTime + TRANSFER_TIME_THRESHOLD;

    if (n.station_id === cur.station_id && n.id !== cur.id && neighbourDepartTime < threshold) {
      output.push(n.id);
    }
  }

  return output;
}

function getReachableStops(cur: Stop): Stop[] {
  const output: Stop[] = [];
  const curArrivalTime = cur.arrival;
  const sameHourTimestamp = getTimestampId(new Date(curArrivalTime));
  const nextHourTimestamp = getTimestampId(new Date(curArrivalTime + HOUR));
  const nextTwoHourTimestamp = getTimestampId(new Date(curArrivalTime + HOUR * 2));
  const stopsOfSameHour = stopsByDate[sameHourTimestamp];
  const stopsOfNextHour = stopsByDate[nextHourTimestamp];
  const stopsOfNextTwoHour = stopsByDate[nextTwoHourTimestamp];

  if (stopsOfSameHour) {
    output.push(...stopsOfSameHour);
  }

  if (stopsOfNextHour) {
    output.push(...stopsOfNextHour);
  }

  if (stopsOfNextTwoHour) {
    output.push(...stopsOfNextTwoHour);
  }

  return output;
}
