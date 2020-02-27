import { promises as fs } from 'fs';
import path from 'path';
import load from './loader';
import hanleDOM from './handleDom';
import resoursesLoad from './resourseLoader';

const debug = require('debug')('page-loader: index');

const getMainFileName = (url) => {
  const segments = [
    url.host.split('.'),
    url.pathname.split('/')].flat();
  const filteredSegments = segments.filter((el) => el !== '');
  return filteredSegments.join('-');
};

const getFilePath = (dir, fileName, extension) => path.join(dir, `${fileName}${extension}`);
const getResoursesPath = (dir, dirname, postfix = '_files') => path.join(dir, `${dirname}${postfix}`);

const pageLoad = (href, outputDir) => {
  debug('Start app');
  const url = new URL(href);
  const fileName = getMainFileName(url);
  const filePath = getFilePath(outputDir, fileName, '.html');
  const base = url.origin;
  const resoursesDir = getResoursesPath(outputDir, fileName);
  const resourseDirPromise = fs.mkdir(resoursesDir, { recursive: true });
  const responsePromise = load(href);
  return resourseDirPromise
    .then(() => responsePromise)
    .then(({ data }) => {
      debug(`Resource file directory created - ${resoursesDir}`);
      debug('Main HTML loaded into memory');
      const [html, resoursesLink] = hanleDOM(data, base, resoursesDir);
      const writehHtmlPromise = fs.writeFile(filePath, html, 'utf8');
      const loadAndWriteResPromise = resoursesLoad(resoursesLink);
      return Promise.all([writehHtmlPromise, loadAndWriteResPromise]);
    })
    .then(() => {
      debug('A page is full download');
      return `Open ${outputDir}`;
    });
};

export default pageLoad;
