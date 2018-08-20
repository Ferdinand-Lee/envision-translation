const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

function isObject(val) {
  return val != null && typeof val === 'object' && Array.isArray(val) === false;
};

function extract(result, obj, field, label) {
  if (isObject(obj)) {
    if (obj[field] && obj[label]) {
      result[obj[field]] = obj[label];
    }
    for ([key, value] of Object.entries(obj)) {
      extract(result, value, field, label)
    }
  } else if (Array.isArray(obj)) {
    obj.forEach(item => {
      extract(result, item, field, label);
    })
  }
}
const result = Object.create(null);
var dirs = fs.readdirSync(path.resolve(__dirname, '../resources/json')).forEach((file) => {
  var data = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../resources/json', file)));
  extract(result, data, 'name', 'label');
})

console.log(result);
const json = Object.entries(result).map(([key, value]) => {
  return {
    fullName: key,
    value: value,
    shortDescription: '',
    categories: '',
    en_US: '',
    zh_CN: ''
  }
})
const wb = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(json), 'translate')
XLSX.writeFile(wb, path.resolve(__dirname, './../resources/env-translate.xlsx'));