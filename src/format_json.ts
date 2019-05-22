import { writeFileSync } from 'fs';
import { join } from 'path';

const fileName = process.argv[2];
const filePath = join(process.cwd(), fileName);
const jsonFile = require(filePath);

writeFileSync(filePath, JSON.stringify(jsonFile, null, 2));
