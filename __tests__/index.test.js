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
let outputDir;

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
    outputDir = await fs.mkdtemp(path.join(os.tmpdir(), 'page-loader-'));
  });

  test('check information message', async () => {
    checkInfDebug('Start test');
    checkInfDebug(`Output dir = ${outputDir}`);
    const expected = `Open ${outputDir}`;
    await expect(loadPage(testUrl, outputDir)).resolves.toBe(expected);
    checkInfDebug('Stop test');
  });

  test('check data comparison', async () => {
    dataComparisonDebug('Start test');
    dataComparisonDebug(`Output dir = ${outputDir}`);
    const resoursesDir = path.join(outputDir, resoursesDirName);
    dataComparisonDebug(`resourses dir = ${resoursesDir}`);

    await loadPage(testUrl, outputDir);
    const recievedFile = getFilePath(resultName, '.html', outputDir);
    const reсievedData = await fs.readFile(recievedFile, 'utf8');
    dataComparisonDebug('get test data');
    const expectedFile = getFilePath('result', '.html');
    const expectedData = await fs.readFile(expectedFile, 'utf8');
    dataComparisonDebug('get snapshot data');
    const files = await fs.readdir(resoursesDir);
    dataComparisonDebug(`get files - ${files}`);
    expect(files).toHaveLength(3);
    expect(reсievedData).toEqual(expectedData);
  });

  test('not found page test', async () => {
    await expect(loadPage('http://government.ru/notfound', outputDir)).rejects.toMatchObject({ code: '404' });
  });
});
