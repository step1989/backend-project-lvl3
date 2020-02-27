install:
	npm ci
localinstall:
	npm install
start: build test-coverage lintfix
publish:
	npm publish --dry-run
build:
	rm -rf dist
	npm run build
lint:
	npx eslint .
lintfix:
	npx eslint --fix .
test:
	npm test
test-coverage:
	npm test -- --coverage
link:
	npm link
debug:
	DEBUG=page-loader:* dist/bin/page-loader.js -o /tmp https://git-scm.com/downloads
debugaxios:
	DEBUG=axios dist/bin/page-loader.js -o /tmp https://git-scm.com/downloads
