const fs = require('fs');
const csv = require('csv-parser');
var proj4 = require("proj4")

const grs80 = "+proj=tmerc +lat_0=38 +lon_0=127.5 +k=0.9996 +x_0=1000000 +y_0=2000000 +ellps=GRS80 +units=m +no_defs";
const wgs84 = "+title=WGS 84 (long/lat) +proj=longlat +ellps=WGS84 +datum=WGS84 +units=degrees"

function processData(data) {
  // Your function logic to process column1 and column2 data
  // For example, you might concatenate them:
  const grToWg = proj4(grs80, wgs84, [Number(data.x), Number(data.y)])
  const newColumn1 = grToWg[0];
  const newColumn2 = grToWg[1];
  return {
    newColumn1,
    newColumn2
  };
}

const inputFile = 'RiskArea.csv';
const outputFile = 'output.csv';

const results = [];

fs.createReadStream(inputFile)
  .pipe(csv())
  .on('data', (data) => {
    const processedData = processData(data);
    results.push(processedData);
  })
  .on('end', () => {
    console.log(results)
    const csvString = results.map((row) => Object.values(row).join(',')).join('\n');
    fs.writeFileSync(outputFile, csvString);
    console.log('CSV file processed successfully!');
  });