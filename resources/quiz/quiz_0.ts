let sum = 0;
const arr = new Array<number>(5);

arr.forEach((n: number) => (sum += n));

console.log(sum);