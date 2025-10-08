import { forSquares, forEachSquares } from '../q01';

test('array test [3,5,7,3,8,9,1]', () => {
  const input = [3, 5, 7, 3, 8, 9, 1];
  const expected = [9, 25, 49, 9, 64, 81, 1];
  expect(forSquares(input)).toEqual(expected);
});

test('array test [3,5,7,3,8,9,1]', () => {
  const input = [3, 5, 7, 3, 8, 9, 1];
  const expected = [9, 25, 49, 9, 64, 81, 1];
  expect(forEachSquares(input)).toEqual(expected);
});