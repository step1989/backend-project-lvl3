import cheerio from 'cheerio';
import path from 'path';

const debug = require('debug')('page-loader: DOM');

const mappingTag = {
  img: 'src',
  script: 'src',
  link: 'href',
};

const hasRelativeFilePath = (url, base) => url.origin === base;
const getRelativeFilePath = (filePath) => {
  const { dir, base } = path.parse(filePath);
  const segments = dir.split('/');
  const endSegment = segments[segments.length - 1];
  return path.join(endSegment, base);
};
const getFilePath = (dir, fileName, extension) => path.join(dir, `${fileName}${extension}`);

const hanleDOM = (data, base, outputDir) => {
  const $ = cheerio.load(data, { decodeEntities: false, xmlMode: false });
  debug('DOM is load in cherio');
  const resoursesLinks = [];
  Object.entries(mappingTag).forEach(([tag, attribut]) => {
    debug(`entries - ${tag} ${attribut}`);
    $(tag).each((index, el) => {
      const link = $(el).attr(attribut);
      debug(`link - ${link}`);
      const resourseUrl = new URL(link, base);
      debug(`Resourse url - ${resourseUrl}`);
      if (link && hasRelativeFilePath(resourseUrl, base)) {
        const { name, ext } = path.parse(link);
        const filePath = getFilePath(outputDir, name, ext);
        const resourseLink = resourseUrl.href;
        const relativefilePath = getRelativeFilePath(filePath);
        debug(`relativefilePath - ${filePath}`);
        resoursesLinks.push({ link: resourseLink, filePath });
        $(el).attr(mappingTag[el.name], relativefilePath);
      }
    });
  });
  return [$.root().html(), resoursesLinks];
};

export default hanleDOM;
