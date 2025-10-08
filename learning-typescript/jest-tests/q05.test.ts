import { arrFilter } from '../q05';

test('array test', () => {
  const input = [8, 3, 9, 5, 6, 12];
  const expected = [8, 6, 12];
  expect(arrFilter(input)).toEqual(expected);
})