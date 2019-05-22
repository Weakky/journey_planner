import { writeFileSync } from 'fs';
import { StopWithNumber as Stop } from './types';

// const journey: Journey = {
//   id: 1,
//   from: 'A',
//   to: 'D',
//   departure: 1,
//   arrival: 1,
//   unreachable: true,
//   legs: [
//     {
//       trainId: 1,
//       from: 'A',
//       to: 'C',
//       departure: 1,
//       arrival: 2
//     },
//     {
//       trainId: 2,
//       from: 'C',
//       to: 'D',
//       departure: 2,
//       arrival: 3,
//       valid: false
//     },
//     {
//       trainId: 3,
//       from: 'D',
//       to: 'E',
//       departure: 3,
//       arrival: 4
//     }
//   ]
// }

const journeysByTrainId = {
  1: [`A-B;05-02-2019;0`, 2, 3]
};

const journeysMap = {
  'A-B': {
    '05-02-2019': [1, 2, 3],
    '05-03-2019': [4, 5, 6],
    '05-04-2019': []
  },
  'A-C': {
    '05-02-2019': [],
    '05-03-2019': [],
    '05-04-2019': []
  },
  'A-D': {
    '05-02-2019': [],
    '05-03-2019': [],
    '05-04-2019': []
  }
};

// const stops = require('./stops.json') as Stop[]
// const trains = require('./trains.json') as Train[]

// /**
//  *
//  * train: 1
//  * stops: 1, 2, 3
//  *
//  * train: 2
//  * stops: 3, 4, 5
//  */

// function buildGraph(): Journeys {
//   const stopsLength = stops.length
//   const output: Journeys = {}

//   // Algo A -> tout les trajets direct

//   for (let i = 0; i < stopsLength; i++) {
//     const stopA = stops[i]

//     //
//     for (let j = 0; j < stopsLength; j++) {
//       const stopB = stops[j]

//       if (!output[`${stopA.id}-${stopB.id}`]) {
//         output[`${stopA.id}-${stopB.id}`] = {}
//       }

//       output[`${stopA.id}-${stopB.id}`][stopA.departure].push(buildJourney(stopA, stopB))
//     }
//   }

//   return output
// }

// function findReachableStops(target: Stop, allStops: Stop[]) {
//   return allStops.filter(s => s.station_id === target.station_id && s.id !== target.id)
// }

// function buildJourney(stopA: Stop, stopB: Stop): Journey {}

interface Trip {
  trainId: number;
  from: number;
  to: number;
  departure: number;
  arrival: number;
}

type TripTuple = [number, number];

interface Journey {
  from: number;
  to: number;
  departure: number;
  arrival: number;
  legs: Trip[];
}

interface Journeys {
  [journeyId: string]: {
    [date: string]: Journey[];
  };
}

interface TripStop {
  id: number;
  station_id: number;
  station_name: string;
  departure: string;
  arrival: string;
}

interface Train {
  id: number;
  stops: TripStop[];
}

interface StackItem {
  parent?: Stop;
  value: Stop;
  legs: Trip[];
}

//const trains = require('../data/big_trains.json') as Train[]

//const map = computeTravels({ trains })

// // const keys = Object.keys(map)
// // const keysLength = keys.length

// // let jsonOutput = ''

// // for (let i = 0; i < keysLength; i++) {
// //   jsonOutput += '{'
// //   jsonOutput += `"${keys[i]}":`
// //   jsonOutput += JSON.stringify(map[keys[i]])
// //   jsonOutput += '}\n'
// // }

// function computeTravels(input: { trains: Train[] }) {
//   let output: Journeys = {}
//   const { trains } = input
//   const trainLength = trains.length

//   for (let i = 0; i < trainLength; i++) {
//     const train = trains[i]

//     console.time(`Train [${train.id}]: ${i}/${trains.length}`)
//     output = computeDirectJourneys(train, output)
//     console.timeEnd(`Train [${train.id}]: ${i}/${trains.length}`)
//   }

//   for (let i = 0; i < stops.length; i++) {
//     const currStop = stops[i]
//     const reachableStops = findReachableStops(currStop, stops)
//     const firstReachableStop = reachableStops[0]
//   }

//   return output
// }

// function findReachableStops(cur: Stop, allStops: Stop[]) {
//   const length = allStops.length
//   const output: Stop[] = []
//   const curArrivalTime = getTime(cur.arrival)
//   const HOUR = 60 * 60 * 1000
//   const TRANSFER_TIME_THRESHOLD = HOUR * 2

//   for (let i = 0; i < length; i++) {
//     const n = allStops[i]
//     const neighbourDepartTime = getTime(n.departure)

//     if (
//       n.station_id === cur.station_id &&
//       n.id !== cur.id &&
//       curArrivalTime + TRANSFER_TIME_THRESHOLD < neighbourDepartTime
//     ) {
//       output.push(n)
//     }
//   }

//   return output
// }

const stops = require('../stops_date_number.json') as Stop[];
const stopsById = require('../stops_by_id.json') as Record<number, Stop>;
const neighbourMap = require('../neighbour_map.json') as Record<number, number[]>;

console.time('Computing graph...');
const result = computeConnectionJourneys(stops, {});
writeFileSync('graph.json', JSON.stringify(result, null, 2));
console.timeEnd('Computing graph...');

function getNeighbours(ids: number[]) {
  const neighbours: Stop[] = [];
  const length = ids.length;

  for (let i = 0; i < length; i++) {
    neighbours.push(stopsById[ids[i]]);
  }

  return neighbours;
}

function computeConnectionJourneys(stops: Stop[], journeys: Journeys): Journeys {
  const stopsLength = 20000;
  const stack: StackItem[] = [];

  for (let i = 0; i < stopsLength; i++) {
    console.log(`${i}/${stopsLength}`);

    stack.push({
      value: stops[i],
      legs: []
    });

    while (stack.length > 0) {
      const cur = stack.pop()!;
      const legsLength = cur.legs.length;

      // Find all reachable stops
      const neighboursIds = neighbourMap[cur.value.id];
      const neighbours = getNeighbours(neighboursIds);
      const neighboursLength = neighbours.length;
      //console.log('found neighbours: ', neighboursLength)

      // Iterate over neighbourgs
      for (let j = 0; j < neighboursLength; j++) {
        const curNeighbour = neighbours[j];

        const newLeg: Trip = {
          trainId: cur.value.train_id,
          from: cur.value.id,
          to: curNeighbour.id,
          departure: cur.value.departure,
          arrival: cur.value.departure
        };
        // Create a journey with the new leg and the previous ones

        let journey: Journey;
        // If there's a leg
        if (legsLength > 0) {
          const fromLeg = cur.legs[0];
          const toLeg = cur.legs[legsLength - 1];

          journey = {
            from: fromLeg.from,
            to: toLeg.to,
            departure: fromLeg.departure,
            arrival: toLeg.arrival,
            legs: [...cur.legs, newLeg]
          };
        } else {
          journey = {
            from: cur.value.station_id,
            to: curNeighbour.station_id,
            departure: cur.value.departure,
            arrival: curNeighbour.arrival,
            legs: [newLeg]
          };
        }

        journeys = addJourney(journey, journeys);

        // Append stop to the stack
        if (journey.legs.length <= 2) {
          stack.unshift({
            parent: cur.value,
            value: curNeighbour,
            legs: journey.legs
          });
        }
      }
    }
  }

  return journeys;
}

function addJourney(journey: Journey, journeys: Journeys) {
  const journeyId = `${journey.from}-${journey.to}`;

  if (!journeys[journeyId]) {
    journeys[journeyId] = {};
  }

  const timestamp = new Date(journey.departure);
  const timestampId = `${timestamp.getFullYear()}-${timestamp.getMonth()}-${timestamp.getDay()}`;

  if (!journeys[journeyId][timestampId]) {
    journeys[journeyId][timestampId] = [];
  }

  journeys[journeyId][timestampId].push(journey);

  return journeys;
}

function computeDirectJourneys(train: Train, journeys: Journeys): Journeys {
  const stops = train.stops;
  const stopsLength = stops.length;

  for (let i = 0; i < stopsLength; i++) {
    for (let j = 0; j < stopsLength; j++) {
      const from = stops[i];
      const to = stops[j];

      if (from.id === to.id) {
        continue;
      }

      if (j < i) {
        continue;
      }

      if (!journeys[`${from.station_id}-${to.station_id}`]) {
        journeys[`${from.station_id}-${to.station_id}`] = {};
      }

      const departure = getTime(from.departure);
      const arrival = getTime(to.arrival);

      if (!journeys[`${from.station_id}-${to.station_id}`][extractDate(from.departure)]) {
        journeys[`${from.station_id}-${to.station_id}`][extractDate(from.departure)] = [];
      }

      journeys[`${from.station_id}-${to.station_id}`][extractDate(from.departure)].push({
        from: from.station_id,
        to: to.station_id,
        departure,
        arrival,
        legs: [
          {
            from: from.id,
            to: to.id,
            departure,
            arrival,
            trainId: train.id
          }
        ]
      });
    }
  }

  return journeys;
}

function extractDate(dateString: string) {
  return dateString.split(' ')[0];
}

function getTime(dateString: string) {
  const [date, time] = dateString.split(' ');
  const [year, month, day] = date.split('-');
  const [hours, minutes, seconds] = time.split(':');

  return new Date(
    parseInt(year, 10),
    parseInt(month, 10),
    parseInt(day, 10),
    parseInt(hours, 10),
    parseInt(minutes, 10),
    parseInt(seconds, 10)
  ).valueOf();
}
