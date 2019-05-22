import { writeFileSync } from "fs";
import { join } from "path";

const filePath = join(__dirname, "../data/stops_date_string.json");
const jsonFile = require(filePath);

writeFileSync(filePath, JSON.stringify(jsonFile, null, 2));
