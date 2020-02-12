import axios from 'axios';
import { promises as fs } from 'fs';
import url from 'url';
import path from 'path';
import { flattenDeep } from 'lodash';

const defaultOutputDir = process.cwd();

const getPathFile = (fileName, dir, extension = 'html') => path.join(dir, `${fileName}.${extension}`);

const pageloader = (uri, outputDir = defaultOutputDir) => {
  const { host, pathname } = url.parse(uri);
  // выглядит страшно - переделать - вынести в отдельную функцию - нужна для использования в тестах
  const fileName = flattenDeep([host.split('.'), pathname.split('/')]).filter((el) => el !== '').join('-');
  const pathFile = getPathFile(fileName, outputDir);
  return axios.get(uri)
    .then((response) => {
      fs.writeFile(pathFile, response.data, 'utf8');
    })
    .then(() => `Open ${outputDir}`)
    .catch((error) => {
      console.log(error);
    });
};

export default pageloader;
