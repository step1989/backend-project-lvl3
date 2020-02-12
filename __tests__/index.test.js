import path from 'path';
import os from 'os';
import nock from 'nock';
import { promises as fs } from 'fs';
import pageloader from '../src';

nock.disableNetConnect();
const testUrl = 'http://government.ru/';
const getPathFile = (fileName, extension = 'html', pathdir = `${__dirname}/__fixtures__/`) => path.join(pathdir, `${fileName}.${extension}`);
let outputDir;
let expectedData;

describe('download page test', () => {
  beforeAll(async () => {
    outputDir = await fs.mkdtemp(path.join(os.tmpdir(), 'page-loader-'));
    const testFile = getPathFile('example');
    expectedData = await fs.readFile(testFile, 'utf8');
    nock(testUrl)
    // метод сохраняет состояние для всех тестов
      .persist()
      .get('/')
      .reply(200, expectedData);
  });

  test('test on information message', async () => {
    const expected = `Open ${outputDir}`;
    await expect(pageloader(testUrl, outputDir)).resolves.toBe(expected);
  });
  test('test data comparison', async () => {
    const recievedFile = getPathFile('government-ru', 'html', outputDir);
    const revievedData = await fs.readFile(recievedFile, 'utf8');
    await pageloader(testUrl, outputDir);
    expect(revievedData).toEqual(expectedData);
  });
});
