import { promises as fs } from 'fs';
import path from 'path';
import load from './loader';
import convertDOM from './converterDom';
import UrlHelper from './UrlHelper';

const debug = require('debug')('page-loader: index');

const defaultOutputDir = process.cwd();

const getPathFile = (fileName, dir, extension = 'html') => path.join(dir, `${fileName}.${extension}`);
const getPathResourses = (dirname, dir, postfix = '_files') => path.join(dir, `${dirname}${postfix}`);

const pageloader = (href, outputDir = defaultOutputDir) => {
  debug('Start app');
  const myUrl = new UrlHelper(href);
  const fileName = myUrl.getFileName();
  const pathFile = getPathFile(fileName, outputDir);
  const base = myUrl.getOrigin();
  const resoursesDir = getPathResourses(fileName, outputDir);
  debug('Start load page');
  const responsePromise = load(href);
  return responsePromise
    .then(({ data }) => {
      const html = convertDOM(data, base, resoursesDir);
      fs.writeFile(pathFile, html, { flags: 'wx' }, 'utf8');
    })
    .then(() => {
      debug('A page is full download');
      return `Open ${outputDir}`;
    })
    .catch((error) => console.log(`Ошибка при записи html ${error}`));
};

export default pageloader;
