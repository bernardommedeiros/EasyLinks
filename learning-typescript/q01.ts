/* Faça um programa TypeScript que calcule o quadrado de cada elemento do array, use as seguintes estratégias:
iterando com for simples
iterando com forEach
Escreve um teste com o array [3,5,7,3,8,9,1]
*/

let arrayNumbers: number[] = [3,5,7,3,8,9,1]

console.log('for')
for (let i = 0; i < arrayNumbers.length; i++) {
    const number = arrayNumbers[i];
    if (number !== undefined){
        console.log(number * number)
    }
}
console.log('----------')
console.log('foreach')

arrayNumbers.forEach((number: number) => {
    console.log(number * number)
})
