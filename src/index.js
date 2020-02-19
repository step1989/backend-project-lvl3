import { promises as fs } from 'fs';
import path from 'path';
import load from './loader';
import hanleDOM from './converterDom';
import UrlHelper from './UrlHelper';
import resourseLoad from './resourseLoader';

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
  debug(`resoursesDir - ${resoursesDir}`);
  const resourseDirProm = fs.mkdir(resoursesDir, { recursive: true });
  debug('Start load page');
  const responsePromise = load(href);
  return resourseDirProm
    .then(() => responsePromise)
    .then(({ data }) => {
      debug(`html before - \n${data}`);
      const [html, resoursesLink] = hanleDOM(data, base, resoursesDir);
      debug(`html after - \n${html}`);
      const writehHtmlProm = fs.writeFile(pathFile, html, 'utf8');
      const loadAndWriteResProm = resourseLoad(resoursesLink);
      return Promise.all([writehHtmlProm, loadAndWriteResProm]);
    })
    .then(() => {
      debug('A page is full download');
      return `Open ${outputDir}`;
    });
};

export default pageloader;
