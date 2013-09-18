test:
	./node_modules/.bin/mocha -R spec -t 5000 --recursive

.PHONY: test
