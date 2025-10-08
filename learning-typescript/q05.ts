/* Faça um programa que leia o array e extrai os elementos pares. Use o método FILTER da classe Array, passando uma função arrow como parâmetro.
Escreva um teste com o array [8, 3, 9, 5, 6, 12] */

let arr : number[] = [8, 3, 9, 5, 6, 12]

export const arrFilter = (arr: number[]) => {
    return arr.filter(num => num % 2 == 0)
}

console.log(arrFilter(arr))
