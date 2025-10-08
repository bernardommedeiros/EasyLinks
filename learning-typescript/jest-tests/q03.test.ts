import { arrOrder } from '../q03';

test('array test', () => {
  const input = ['carro', 'boneco', 'ave', 'lapis'];
  const expected = ['lapis', 'carro', 'boneco', 'ave'];
  expect(arrOrder(input)).toEqual(expected);
})