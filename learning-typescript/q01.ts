/* Faça um programa TypeScript que calcule o quadrado de cada elemento do array, use as seguintes estratégias:
iterando com for simples
iterando com forEach
Escreve um teste com o array [3,5,7,3,8,9,1]
*/

let arrayNumbers: number[] = [3,5,7,3,8,9,1]

export function forSquares(arrayNumbers: number[]) {
    const result: number[] = []
    for (let i = 0; i < arrayNumbers.length; i++) {
        const number = arrayNumbers[i];
        if (number !== undefined){
            result.push(number * number)
        }
    }
    return result
}

export function forEachSquares(arrayNumbers: number[]): number[] {
  return arrayNumbers.map((number: number) => number * number);
}