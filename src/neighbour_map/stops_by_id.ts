import { writeFileSync } from 'fs';
const stops = require('../../stops_date_number.json') as any[];

groupById();

function groupById() {
  const output: Record<number, any> = {};
  const length = stops.length;

  for (let i = 0; i < length; i++) {
    console.log(`group_by_id: ${i}/${length}`);
    const cur = stops[i];

    output[cur.id] = cur;
  }

  writeFileSync('stops_by_id.json', JSON.stringify(output, null, 2));
}
