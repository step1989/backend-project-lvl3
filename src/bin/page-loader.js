#!/usr/bin/env node
import program from 'commander';
import pageloader from '..';

program.version('1.0.1')
  .description('Downloader a web pages')
  .option('-o, --output [path]', 'output folder')
  .arguments('<path>')
  .action((path, option) => {
    pageloader(path, option.output).then(console.log);
  })
  .parse(process.argv);
