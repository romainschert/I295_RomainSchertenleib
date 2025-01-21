/**
 * Vous devez faire la somme des entiers présent dans le tableau numbers
 */

let numbers = [1, 2, 3, 4, 5];

// Solution utilisant le paradigme procédurale
let sum;

/*for (let i = 0; numbers.length; i++) {
  sum += numbers[i];
}

for (let num of numbers) {
  sum += num;
}

numbers.forEach((num) => {
  sum += num;
});
// Solution utilisant le paradigme fonctionnel
*/
sum = numbers.reduce((somme, currentvalue) => {
  return somme + currentvalue;
}, 0);

console.log(sum); // 15
