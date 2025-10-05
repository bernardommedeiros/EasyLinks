/* Crie duas classes que possuam uma interface em comum. Evite criar classes com nomes sem significado (class A, class X). Crie classes com nomes que representem algo significativo.
As classes devem possuir atributos diferentes.
A interface deve possuir pelo menos um método.
A implementação desse método nas classes deve utilizar os atributos.
Escreve um teste que instancie as classes criadas, altera os atributos e teste o método comum na interface. */

interface Description {
  desc(): string;
}

class Birthday implements Description {
  name: string;
  birth: string;

  constructor(name: string, birth: string) {
    this.name = name;
    this.birth = birth;
  }

  desc(): string {
    return `O aniversário de ${this.name} é dia ${this.birth}.`;
  }
}

class Tads implements Description {
  started: string;
  graduate: string;
  

  constructor(started: string, graduate: string) {
    this.started = started;
    this.graduate = graduate;
  }

  desc(): string {
    return `Nossa turma de TADS entrou em ${this.started} e iremos nos graduar em ${this.graduate}.`;
  }
}

const myBirthday = new Birthday("Bernardo", "18/11");
const myClass = new Tads("2024.1", "2026.2");

console.log(myBirthday.desc()); 
console.log(myClass.desc()); 

console.log("-----------------------------------------------------------------------")


myBirthday.name = "Bernardo Medeiros";
myClass.graduate = "2027.1";

console.log(myBirthday.desc()); 
console.log(myClass.desc()); 

