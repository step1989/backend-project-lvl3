import path from 'path';
import os from 'os';
import nock from 'nock';
import { promises as fs } from 'fs';
import pageloader from '../src';

nock.disableNetConnect();
const checkInfDebug = require('debug')('page-loader: check information message test');
const dataComparisonDebug = require('debug')('page-loader: data comparison test');

const testUrl = 'http://government.ru/docs/';
const resultName = 'government-ru-docs';
const resoursesDirName = 'government-ru-docs_files';
const getPathFile = (fileName, extension = 'html', pathdir = `${__dirname}/__fixtures__/`) => path.join(pathdir, `${fileName}.${extension}`);
let testData;

describe('download page test', () => {
  beforeAll(async () => {
    // добавить роуты для ресурсов
    const testFile = getPathFile('example');
    testData = await fs.readFile(testFile, 'utf8');
    nock(testUrl)
    // метод сохраняет состояние для всех тестов
      .persist()
      .log(console.log)
      .get(/$/)
      .reply(200, testData);
  });

  test('check information message', async () => {
    checkInfDebug('Start test');
    const outputDir = await fs.mkdtemp(path.join(os.tmpdir(), 'page-loader-'));
    checkInfDebug(`Output dir = ${outputDir}`);
    const expected = `Open ${outputDir}`;
    await expect(pageloader(testUrl, outputDir)).resolves.toBe(expected);
    checkInfDebug('Stop test');
  });

  test('check data comparison', async () => {
    dataComparisonDebug('Start test');
    const outputDir = await fs.mkdtemp(path.join(os.tmpdir(), 'page-loader-'));
    dataComparisonDebug(`Output dir = ${outputDir}`);
    const resoursesDir = path.join(outputDir, resoursesDirName);
    dataComparisonDebug(`resourses dir = ${resoursesDir}`);
    await pageloader(testUrl, outputDir);

    const recievedFile = getPathFile(resultName, 'html', outputDir);
    const reсievedData = await fs.readFile(recievedFile, 'utf8');
    dataComparisonDebug('получены тестовые данные');
    const expectedFile = getPathFile('result');
    const expectedData = await fs.readFile(expectedFile, 'utf8');
    dataComparisonDebug('получены эталонные данные');
    const files = await fs.readdir(resoursesDir);
    dataComparisonDebug(`получен список файлов - ${files}`);
    expect(files).not.toHaveLength(0);
    expect(reсievedData).toEqual(expectedData);
    dataComparisonDebug('Stop test');
  });
});
