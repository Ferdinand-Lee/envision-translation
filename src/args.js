module.exports = exports = process.argv.slice(2).reduce((result, arg) => {
  const [key, value] = arg.split('=');
  result[key.substring(2)] = value;
  return result;
}, {})