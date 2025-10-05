/* Faça um Programa TypeScript que transforme o array, concatenando as strings com 1 (um) espaço (“ “). Utilize o método JOIN da classe Array, passando uma função arrow como parâmetro.
Escreva um teste com o array [‘Arrays’, ‘com’, ‘TypeScript’] */

let arrayStrings: string[] = ['Arrays', 'com', 'TypeScript']

const arrayJoin = (arr: string[]) => {
  return arr.join(" ");
};

console.log(arrayJoin(arrayStrings))