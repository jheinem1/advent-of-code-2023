import { readFile } from "fs/promises";

const dayOne = async () => {
  const input = (await readFile("./day-one/input.txt", "utf-8")).split("\n");
  const numbers = input.map((line) => {
    let firstDigit: undefined | string;
    let lastDigit: undefined | string;
    for (const match of line.matchAll(/\d/g)) {
      firstDigit = firstDigit ?? match[0];
      lastDigit = match[0];
    }
    if (firstDigit && lastDigit) {
      return parseInt(firstDigit.concat(lastDigit));
    }
    throw "No numbers found";
  });
  return numbers.reduce((a, b) => a + b);
};

dayOne()
  .then((solution) => console.log(solution))
  .catch((err) => console.error(err));
