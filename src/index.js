import { promises as fs } from 'fs';
import url from 'url';
import path from 'path';
import { flattenDeep } from 'lodash';
import load from './loader';
import convertDOM from './converterDom';

const defaultOutputDir = process.cwd();

const getPathFile = (fileName, dir, extension = 'html') => path.join(dir, `${fileName}.${extension}`);
const getPathResourses = (dirname, dir, postfix = '_files') => path.join(dir, `${dirname}${postfix}`);

const pageloader = (uri, outputDir = defaultOutputDir) => {
  const { host, pathname, protocol } = url.parse(uri);
  // выглядит страшно - переделать - вынести в отдельную функцию - нужна для использования в тестах
  const fileName = flattenDeep([host.split('.'), pathname.split('/')]).filter((el) => el !== '').join('-');
  const pathFile = getPathFile(fileName, outputDir);
  const base = `${protocol}//${host}`;
  const resoursesDir = getPathResourses(fileName, outputDir);
  const response = load(uri);
  return response
    .then(({ data }) => {
      const html = convertDOM(data, base, resoursesDir);
      fs.writeFile(pathFile, html, { flags: 'wx' }, 'utf8');
    })
    .then(() => `Open ${outputDir}`)
    .catch((error) => console.log(`Ошибка при записи html ${error}`));
};

export default pageloader;
