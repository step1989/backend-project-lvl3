import { promises as fs } from 'fs';
import load from './loader';

const debug = require('debug')('page-loader: resourseLoader');

const resourseLoad = (links) => {
  const promises = links.reduce((acc, val) => {
    const [href, filePath] = Object.values(val);
    debug(`href - ${href}`);
    debug(`filePath - ${filePath}`);
    const downloadPromise = load(href, 'arraybuffer');
    const writePromise = downloadPromise.then(({ data }) => fs.writeFile(filePath, data, 'utf8'));
    return [...acc, writePromise];
  }, []);
  return Promise.all(promises);
};
export default resourseLoad;
