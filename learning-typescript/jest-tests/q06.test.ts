import { Birthday, Tads } from '../q06';

test('Birthday desc() method returns correct string', () => {
  const birthday = new Birthday('Ana', '10/10/2000');
  expect(birthday.desc()).toBe('O aniversário de Ana é dia 10/10/2000.');

  // alterando os atributos
  birthday.name = 'Lucas';
  birthday.birth = '01/01/1995';
  expect(birthday.desc()).toBe('O aniversário de Lucas é dia 01/01/1995.');
});

test('Tads desc() method returns correct string', () => {
  const turma = new Tads('2023', '2026');
  expect(turma.desc()).toBe('Nossa turma de TADS entrou em 2023 e iremos nos graduar em 2026.');

  // alterando os atributos
  turma.started = '2024';
  turma.graduate = '2027';
  expect(turma.desc()).toBe('Nossa turma de TADS entrou em 2024 e iremos nos graduar em 2027.');
});
