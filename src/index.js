import { promises as fs } from 'fs';
import load from './loader';
import PathHelper from './PathHelper';
import hanleDOM from './handleDom';
import UrlHelper from './UrlHelper';
import resoursesLoad from './resourseLoader';

const debug = require('debug')('page-loader: index');

const defaultOutputDir = process.cwd();
const extension = '.html';

const pageloader = (href, outputDir = defaultOutputDir) => {
  debug('Start app');
  const url = new UrlHelper(href);
  const fileName = url.getFileName();
  const pathFile = PathHelper.getFilePath(outputDir, fileName, extension);
  const base = url.getOrigin();
  const resoursesDir = PathHelper.getPathResourses(outputDir, fileName);
  const resourseDirPromise = fs.mkdir(resoursesDir, { recursive: true });
  const responsePromise = load(href);
  return resourseDirPromise
    .then(() => responsePromise)
    .then(({ data }) => {
      debug(`html before - \n${data}`);
      const [html, resoursesLink] = hanleDOM(data, base, resoursesDir);
      debug(`html after - \n${html}`);
      const writehHtmlPromise = fs.writeFile(pathFile, html, 'utf8');
      const loadAndWriteResPromise = resoursesLoad(resoursesLink);
      return Promise.all([writehHtmlPromise, loadAndWriteResPromise]);
    })
    .then(() => {
      debug('A page is full download');
      return `Open ${outputDir}`;
    });
};

export default pageloader;
