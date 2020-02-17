import cheerio from 'cheerio';
import path from 'path';
import { promises as fs } from 'fs';
import load from './loader';


const mappingTag = {
  img: 'src',
  script: 'src',
  link: 'href',
};

const getPathFile = (fileName, dir) => path.join(dir, `${fileName}`);

// const getFileName = (pathFile) => {
//   const { base } = path.parse(pathFile);
//   return base;
// };

const getRelativePathFile = (pathFile) => {
  const { dir, base } = path.parse(pathFile);
  const segments = dir.split('/');
  const endSegment = segments[segments.length - 1];
  return path.join(endSegment, base);
};

const hasRelativePathFile = (origin, base) => origin === base;

const convertDOM = (data, base, outputDir) => {
  const $ = cheerio.load(data, { decodeEntities: false, xmlMode: true });
  fs.mkdir(outputDir, { recursive: true });
  const promises = [];
  $('img, script, link').each((index, el) => {
    const link = $(el).attr(mappingTag[el.name]);
    if (link) {
      const { origin, href } = new URL(link, base);
      if (hasRelativePathFile(origin, base)) {
        const { base: fileName } = path.parse(link);
        const pathFile = getPathFile(fileName, outputDir);
        const relativePathFile = getRelativePathFile(pathFile);
        const response = load(href, 'arraybuffer');
        response
          .then(({ data: linkData }) => promises.push(fs.writeFile(pathFile, linkData, { flags: 'wx' }, 'utf8')))
          .catch((error) => console.log(`'Ошибка при записи файла' - ${error}`));
        $(el).attr(mappingTag[el.name], relativePathFile);
      }
    }
  });
  Promise.all(promises).catch((error) => console.log(`Произошла ошибка при загрузке доп. файлов\n ${error}`));
  return $.root().html();
};

export default convertDOM;
