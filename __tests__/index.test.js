import path from 'path';
import os from 'os';
import nock from 'nock';
import { promises as fs } from 'fs';
import pageloader from '../src';

const checkInfDebug = require('debug')('page-loader: check information message test');
const dataComparisonDebug = require('debug')('page-loader: data comparison test');

const fixturesPath = `${__dirname}/__fixtures__/`;
const testUrl = 'http://government.ru/docs';
const resultName = 'government-ru-docs';
const resoursesDirName = 'government-ru-docs_files';
const getPathFile = (fileName, extension, pathdir = fixturesPath) => path.join(pathdir, `${fileName}${extension}`);
let outputDir;

describe('download page test', () => {
  beforeAll(async () => {
    nock.disableNetConnect();

    const htmlData = await fs.readFile(getPathFile('example', '.html'), 'utf8');
    const cssData = await fs.readFile(getPathFile('style', '.css'), 'utf8');
    const scriptData = await fs.readFile(getPathFile('script.js', '.test'), 'utf8');
    const imgData = await fs.readFile(getPathFile('test', '.png'));

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

  afterAll(() => {
    nock.enableNetConnect();
  });

  test('check information message', async () => {
    checkInfDebug('Start test');
    checkInfDebug(`Output dir = ${outputDir}`);
    const expected = `Open ${outputDir}`;
    await expect(pageloader(testUrl, outputDir)).resolves.toBe(expected);
    checkInfDebug('Stop test');
  });

  test('check data comparison', async () => {
    dataComparisonDebug('Start test');
    dataComparisonDebug(`Output dir = ${outputDir}`);
    const resoursesDir = path.join(outputDir, resoursesDirName);
    dataComparisonDebug(`resourses dir = ${resoursesDir}`);

    await pageloader(testUrl, outputDir);
    const recievedFile = getPathFile(resultName, '.html', outputDir);
    const reсievedData = await fs.readFile(recievedFile, 'utf8');
    dataComparisonDebug('get test data');
    const expectedFile = getPathFile('result', '.html');
    const expectedData = await fs.readFile(expectedFile, 'utf8');
    dataComparisonDebug('get snapshot data');
    const files = await fs.readdir(resoursesDir);
    dataComparisonDebug(`get files - ${files}`);
    expect(files).not.toHaveLength(0);
    expect(reсievedData).toEqual(expectedData);
    dataComparisonDebug('Stop test');
  });

  test('not found page test', async () => {
    await expect(pageloader('http://government.ru/notfound')).rejects.toMatchObject({ code: '404' });
  });
});
