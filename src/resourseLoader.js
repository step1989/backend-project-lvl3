import { promises as fs } from 'fs';
import path from 'path';
import Listr from 'listr';

import load from './loader';

const debug = require('debug')('page-loader: resourseLoader');

const resoursesLoad = (links, resoursesDir) => {
  const promises = links.map(({ href, pathname }) => {
    debug(`href - ${href}`);
    debug(`filePath - ${resoursesDir}`);
    const downloadPromise = load(href, 'arraybuffer');
    const writePromise = downloadPromise.then(({ data }) => {
      const task = new Listr([
        {
          title: `Download resourse file ${href} to:\n ${resoursesDir}`,
          task: () => fs.writeFile(path.join(resoursesDir, pathname), data, 'utf8'),
        },
      ]);
      return task.run();
    });
    return writePromise;
  });
  return Promise.all(promises);
};
export default resoursesLoad;
