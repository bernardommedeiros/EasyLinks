/* Faça um programa que imprima seus elementos ordenados. Use o método SORT da classe Array para ordenar de forma decrescente, passando uma função arrow como parâmetro.
Escreva um teste com o array [‘carro’, ’boneco’, ’ave’, ‘lapis’] */

let arr: string[] = ['carro', 'boneco', 'ave', 'lapis']

export const arrOrder = (arr: string[]) => {
  return arr.sort( (a: string, b: string)=> {
    if (a > b) return -1;
    return 0
  })
}