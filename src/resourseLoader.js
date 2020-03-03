import { promises as fs } from 'fs';
import path from 'path';
import Listr from 'listr';

import load from './loader';

const debug = require('debug')('page-loader: resourseLoader');

const getFilePath = (dir, fileName, extension) => path.join(dir, `${fileName}${extension}`);

const resoursesLoad = (links, resoursesDir) => {
  const promises = links.map(({ href, pathname }) => {
    debug(`href - ${href}`);
    debug(`pathname - ${pathname}`);
    debug(`resoursesDir - ${resoursesDir}`);
    const { name, ext } = path.parse(pathname);
    const filePath = getFilePath(resoursesDir, name, ext);
    const task = {
      title: `Download resourse file ${href} to:\n ${resoursesDir}`,
      task: () => load(href, 'arraybuffer').then(({ data }) => fs.writeFile(filePath, data, 'utf8')),
    };
    return task;
  });
  return new Listr(promises, { concurrent: true }).run();
};
export default resoursesLoad;
