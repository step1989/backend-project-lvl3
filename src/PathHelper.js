import path from 'path';

export default class PathHelper {
  static getFilePath(dir, fileName, extension) {
    return path.join(dir, `${fileName}${extension}`);
  }

  static getPathResourses(dir, dirname, postfix = '_files') {
    return path.join(dir, `${dirname}${postfix}`);
  }

  static getRelativeFilePath(filePath) {
    const { dir, base } = path.parse(filePath);
    const segments = dir.split('/');
    const endSegment = segments[segments.length - 1];
    return path.join(endSegment, base);
  }

  static parse(filePath) {
    return path.parse(filePath);
  }
}
