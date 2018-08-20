const path = require('path')
const XLSX = require('xlsx');
const wb = XLSX.readFile(path.resolve(__dirname, '../resources/env-translate.xlsx'));
const sheet = wb.Sheets[wb.SheetNames[0]];
const data = XLSX.utils.sheet_to_json(sheet);

const args = require('./args');
const prefix = args.prefix || '';

module.exports = exports = data.reduce((result, row) => {
  let { labels, zh_CN, en_US } = result;
  labels.push({
    'fullName': [prefix + row.fullName],
    'language': ['en_US'],
    'protected': ['false'],
    'categories': row.categories,
    'shortDescription': [row.shortDescription],
    'value': [row.en_US]
  });
  en_US.push({
    "label": [
      ""
    ],
    "name": [
      prefix + row.fullName
    ]
  })
  zh_CN.push({
    "label": [
      row.zh_CN
    ],
    "name": [
      prefix + row.fullName
    ]
  })
  return result;
}, { labels: [], zh_CN: [], en_US: [] })
