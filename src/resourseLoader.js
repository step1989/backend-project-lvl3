import { promises as fs } from 'fs';
import Listr from 'listr';

import load from './loader';

const debug = require('debug')('page-loader: resourseLoader');

const resoursesLoad = (links) => {
  const promises = links.reduce((acc, val) => {
    const [href, filePath] = Object.values(val);
    debug(`href - ${href}`);
    debug(`filePath - ${filePath}`);
    const downloadPromise = load(href, 'arraybuffer');
    const writePromise = downloadPromise.then(({ data }) => {
      const task = new Listr([
        {
          title: `Download resourse file ${href} to:\n ${filePath}`,
          task: () => fs.writeFile(filePath, data, 'utf8'),
        },
      ]);
      return task.run();
    });
    return [...acc, writePromise];
  }, []);
  return Promise.all(promises);
};
export default resoursesLoad;
