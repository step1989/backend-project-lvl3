import cheerio from 'cheerio';
import PathHelper from './PathHelper';
import UrlHelper from './UrlHelper';

const mappingTag = {
  img: 'src',
  script: 'src',
  link: 'href',
};

const debug = require('debug')('page-loader: DOM');

const hanleDOM = (data, base, outputDir) => {
  const $ = cheerio.load(data, { decodeEntities: false, xmlMode: false });
  debug('DOM is load in cherio');
  const resoursesLinks = [];
  $('img, script, link').filter('[src],[href]').each((index, el) => {
    const link = $(el).attr(mappingTag[el.name]);
    const resourseUrl = new UrlHelper(link, base);
    debug(`Resourse url - ${link}`);
    if (resourseUrl.hasRelativeFilePath(base)) {
      const { name, ext } = PathHelper.parse(link);
      const filePath = PathHelper.getFilePath(outputDir, name, ext);
      const resourseLink = resourseUrl.getHref();
      const relativefilePath = PathHelper.getRelativeFilePath(filePath);
      debug(`relativefilePath - ${filePath}`);
      resoursesLinks.push({ link: resourseLink, filePath });
      $(el).attr(mappingTag[el.name], relativefilePath);
    }
  });
  return [$.root().html(), resoursesLinks];
};

export default hanleDOM;
