const path = require('path');
const fs = require('fs');

const grabComponentsDirecrories = (dir = 'src') => {
  const src = path.join(__dirname, `../${dir}`);
  const list = fs.readdirSync(src);
  let result = [];

  for (const name of list) {
    if (fs.lstatSync(`${src}/${name}`, { withFileTypes: true }).isDirectory()) {
      if (fs.existsSync(path.join(__dirname, `../${dir}/${name}/index.ts`))) {
        result = [...result, path.join(__dirname, `../${dir}/${name}/index.ts`)];
      } else {
        fs.readdirSync(path.join(__dirname, `../${dir}/${name}`)).forEach(file => {
          result = [...result, path.join(__dirname, `../${dir}/${name}/${file}`)];
        });
      }
    } else {
      result = [...result, path.join(__dirname, `../${dir}/${name}`)];
    }
  }

  return result;
};

module.exports = grabComponentsDirecrories;
