
class UrlHelper {
  constructor(href, base) {
    this.url = new URL(href, base);
  }

  getHost() {
    return this.url.host;
  }

  getPathName() {
    return this.url.pathname;
  }

  getOrigin() {
    return this.url.origin;
  }

  getHref() {
    return this.url.href;
  }

  getFileName() {
    const segments = [
      this.getHost().split('.'),
      this.getPathName().split('/')].flat();
    const filteredSegments = segments.filter((el) => el !== '');
    return filteredSegments.join('-');
  }

  hasRelativeFilePath(base) {
    return this.getOrigin() === base;
  }
}

export default UrlHelper;
