import { arrSlice } from '../q04';

test('array test', () => {
  const input = [2,4,6,2,8,9,5];
  const expected = [2,4];
  expect(arrSlice(input)).toEqual(expected);
})