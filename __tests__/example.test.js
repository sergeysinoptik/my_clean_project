/* eslint-disable max-len */
/* eslint-disable no-undef */

import {
  a, b, c, d, e, f, g,
} from '../app/file.js';

test('a', () => {
  expect(a(3, 4)).toEqual({ x: 3, y: 4 });
  expect(a(-3, -4)).toEqual({ x: -3, y: -4 });

  // expect(a()).toBeNull();
});

test('b', () => {
  expect(b(5, 3)).toEqual({ angle: 0.54, radius: 5.83 });
  expect(b(-3, -4)).toEqual({ angle: -2.21, radius: 5 });

  // expect(b()).toBeNull();
});

test('c', () => {
  expect(c({ x: 5, y: 3 })).toEqual({ angle: 0.54, radius: 5.83 });
  expect(c({ x: -3, y: -4 })).toEqual({ angle: -2.21, radius: 5 });

  // expect(c()).toBeNull();
});

test('d', () => {
  expect(d({ angle: 0.54, radius: 5.83 })).toEqual({ x: 5, y: 3 });
  expect(d({ angle: -2.21, radius: 5 })).toEqual({ x: -3, y: -4 });

  // expect(d()).toBeNull();
});

test('e', () => {
  expect(e({ x: 4, y: 4 })).toEqual(4);
  expect(e({ x: -3, y: -4 })).toEqual(-3);
  expect(e({ angle: 0.54, radius: 5.83 })).toEqual(5);
});

test('f', () => {
  expect(f({ x: 4, y: 4 })).toEqual(4);
  expect(f({ x: -3, y: -4 })).toEqual(-4);
  expect(f({ angle: 0.54, radius: 5.83 })).toEqual(3);
});

test('g', () => {
  expect(g({ x: -5, y: 3 })).toEqual(1);
  expect(g({ x: -5, y: -3 })).toEqual(2);
  expect(g({ x: 5, y: -3 })).toEqual(3);
  expect(g({ x: 5, y: 3 })).toEqual(4);

  expect(g({ x: 5, y: 0 })).toBeNull();
  expect(g({ x: 0, y: 5 })).toBeNull();
  expect(g({ x: 0, y: 0 })).toBeNull();
});
