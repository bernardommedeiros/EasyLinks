import { arrayJoin } from '../q02';

test('array test', () => {
  const input = ['Arrays', 'com', 'TypeScript'];
  const expected = 'Arrays com TypeScript';
  expect(arrayJoin(input)).toEqual(expected);
});