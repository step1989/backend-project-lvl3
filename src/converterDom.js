import cheerio from 'cheerio';
import path from 'path';
import { promises as fs } from 'fs';
import load from './loader';
import UrlHelper from './UrlHelper';


const mappingTag = {
  img: 'src',
  script: 'src',
  link: 'href',
};

const debug = require('debug')('page-loader: DOM');

const getFilePath = (fileName, dir) => path.join(dir, `${fileName}`);

const getRelativeFilePath = (filePath) => {
  const { dir, base } = path.parse(filePath);
  const segments = dir.split('/');
  const endSegment = segments[segments.length - 1];
  return path.join(endSegment, base);
};

const convertDOM = (data, base, outputDir) => {
  const $ = cheerio.load(data, { decodeEntities: false, xmlMode: true });
  debug('DOM is load');
  fs.mkdir(outputDir, { recursive: true });
  const promises = [];
  $('img, script, link').each((index, el) => {
    const link = $(el).attr(mappingTag[el.name]);
    if (link) {
      const resourseUrl = new UrlHelper(link, base);
      debug(`Getting resourse url - ${link}`);
      if (resourseUrl.hasRelativeFilePath(base)) {
        const { base: fileName } = path.parse(link);
        const filePath = getFilePath(fileName, outputDir);
        const relativefilePath = getRelativeFilePath(filePath);
        debug(`relativefilePath - ${filePath}`);
        const response = load(resourseUrl.getHref(), 'arraybuffer');
        debug('start added promise write resourse file');
        response
          .then(({ data: linkData }) => {
            promises.push(fs.writeFile(filePath, linkData, { flags: 'wx' }, 'utf8'));
          })
          .catch((error) => console.log(`'Ошибка при записи файла' - ${error}`));
        $(el).attr(mappingTag[el.name], relativefilePath);
      }
    }
  });
  Promise.all(promises).catch((error) => console.log(`Произошла ошибка при загрузке доп. файлов\n ${error}`));
  return $.root().html();
};

export default convertDOM;
