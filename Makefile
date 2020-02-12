install:
	install-deps
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
