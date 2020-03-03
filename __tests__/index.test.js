import path from 'path';
import os from 'os';
import nock from 'nock';
import { promises as fs } from 'fs';
import loadPage from '../src';

const checkInfDebug = require('debug')('page-loader: check information message test');
const dataComparisonDebug = require('debug')('page-loader: data comparison test');

const fixturesPath = `${__dirname}/__fixtures__/`;
const testUrl = 'http://government.ru/docs';
const resultName = 'government-ru-docs';
const resoursesDirName = 'government-ru-docs_files';
const getFilePath = (fileName, extension, pathdir = fixturesPath) => path.join(pathdir, `${fileName}${extension}`);
let outputFolder;

describe('download page test', () => {
  beforeAll(async () => {
    nock.disableNetConnect();

    const htmlData = await fs.readFile(getFilePath('example', '.html'), 'utf8');
    const cssData = await fs.readFile(getFilePath('style', '.css'), 'utf8');
    const scriptData = await fs.readFile(getFilePath('script.js', '.test'), 'utf8');
    const imgData = await fs.readFile(getFilePath('test', '.png'));

    nock('http://government.ru')
      .persist()
      .log(console.log)
      .get('/docs')
      .reply(200, htmlData)
      .get('/style.css')
      .reply(200, cssData)
      .get('/script.js.test')
      .reply(200, scriptData)
      .get('/test.png')
      .reply(200, imgData)
      .get('/notfound')
      .replyWithError({
        message: 'Page not found',
        code: '404',
      });
  });

  beforeEach(async () => {
    outputFolder = await fs.mkdtemp(path.join(os.tmpdir(), 'page-loader-'));
  });

  test('check information message', async () => {
    checkInfDebug('Start test');
    checkInfDebug(`Output dir = ${outputFolder}`);
    const expected = outputFolder;
    await expect(loadPage(testUrl, outputFolder)).resolves.toBe(expected);
    checkInfDebug('Stop test');
  });

  test('check data comparison', async () => {
    dataComparisonDebug('Start test');
    dataComparisonDebug(`Output dir = ${outputFolder}`);
    const resoursesDir = path.join(outputFolder, resoursesDirName);
    dataComparisonDebug(`resourses dir = ${resoursesDir}`);

    await loadPage(testUrl, outputFolder);
    const recievedFile = getFilePath(resultName, '.html', outputFolder);
    const reсievedData = await fs.readFile(recievedFile, 'utf8');
    const files = await fs.readdir(resoursesDir);
    dataComparisonDebug(`get files - ${files}`);
    expect(files).toHaveLength(3);
    // expect(reсievedData).toEqual(expectedData);
    expect(reсievedData).toMatchSnapshot();
  });

  test('not found page test', async () => {
    await expect(loadPage('http://government.ru/notfound', outputFolder)).rejects.toMatchObject({ code: '404' });
  });
});
