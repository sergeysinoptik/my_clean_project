# Makefile

jest:
	NODE_OPTIONS=--experimental-vm-modules npx jest

jest-c:
	NODE_OPTIONS=--experimental-vm-modules npx jest --coverage

lint:
	npx eslint .