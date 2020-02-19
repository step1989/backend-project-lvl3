import cheerio from 'cheerio';
import path from 'path';
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

const hanleDOM = (data, base, outputDir) => {
  const $ = cheerio.load(data, { decodeEntities: false, xmlMode: false });
  debug('DOM is load in cherio');
  const resoursesLinks = [];
  $('img, script, link').each((index, el) => {
    debug(`name element - ${el.name}`);
    const link = $(el).attr(mappingTag[el.name]);
    if (link) {
      const resourseUrl = new UrlHelper(link, base);
      debug(`Resourse url - ${link}`);
      if (resourseUrl.hasRelativeFilePath(base)) {
        const { base: fileName } = path.parse(link);
        const resourseLink = resourseUrl.getHref();
        const filePath = getFilePath(fileName, outputDir);
        const relativefilePath = getRelativeFilePath(filePath);
        debug(`relativefilePath - ${filePath}`);
        resoursesLinks.push({ link: resourseLink, filePath });
        $(el).attr(mappingTag[el.name], relativefilePath);
      }
    }
  });
  return [$.root().html(), resoursesLinks];
};

export default hanleDOM;
