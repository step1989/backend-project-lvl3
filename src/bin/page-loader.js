#!/usr/bin/env node
import program from 'commander';
import loadPage from '..';

const defaultOutputDir = process.cwd();
const errorMapper = {
  ENOENT: () => console.error('error: - no such file or directory. Please, check path'),
  ENOTFOUND: (e) => console.error(`error: host not found - ${e.hostname}. Please check link`),
  404: (e) => console.error(`error: Page not found  - ${e.config.url}`),
};


program.version('1.0.1')
  .description('Downloader a web pages')
  .option('-o, --output [path]', 'output folder', defaultOutputDir)
  .arguments('<path>')
  .action((path, option) => {
    loadPage(path, option.output).then((outputFolder) => console.log(`Open ${outputFolder}`)).catch((e) => {
      if (e.code) {
        errorMapper[e.code](e);
      } else {
        errorMapper[e.response.status](e);
      }
      process.exit(1);
    });
  })
  .parse(process.argv);
