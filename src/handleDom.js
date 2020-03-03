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
const getDOM = (data) => cheerio.load(data, { decodeEntities: false, xmlMode: false });

const getResoursesLinks = (data, base) => {
  const $ = getDOM(data);
  debug('DOM is load in cherio for get resourses links');
  const allLinks = Object.entries(mappingTag).map(([tag, attribut]) => {
    const links = $(tag).map((index, link) => $(link).attr(attribut)).get();
    return links;
  }).flat();
  const allUrls = allLinks.map((link) => new URL(link, base));
  const relativeLinks = allUrls.filter((link) => hasRelativeFilePath(link, base));
  debug(`relativeLinks - ${relativeLinks}`);
  return relativeLinks;
};

const handleDOM = (data, base, outputFolder) => {
  const $ = getDOM(data);
  debug('DOM is load in cherio for change');
  Object.entries(mappingTag).forEach(([tag, attribut]) => {
    debug(`tag, attribut  - ${tag}, ${attribut}`);
    $(tag).filter(`[${attribut}]`).each((index, el) => {
      const link = $(el).attr(attribut);
      const resourseUrl = new URL(link, base);
      if (hasRelativeFilePath(resourseUrl, base)) {
        const { name, ext } = path.parse(link);
        const filePath = getFilePath(outputFolder, name, ext);
        const relativefilePath = getRelativeFilePath(filePath);
        debug(`relativefilePath - ${filePath}`);
        $(el).attr(mappingTag[el.name], relativefilePath);
      }
    });
  });
  return $.root().html();
};

export { handleDOM, getResoursesLinks };
