import { readFile } from "fs/promises";

const digitMap = new Map([
  ["one", "1"],
  ["two", "2"],
  ["three", "3"],
  ["four", "4"],
  ["five", "5"],
  ["six", "6"],
  ["seven", "7"],
  ["eight", "8"],
  ["nine", "9"],
]);

const replaceSingleDigitWordsWithNumbers = (line: string) => {
  const newLine = new Array<string>();
  for (let i = 0; i < line.length; i++) {
    const subLine = line.substring(i);
    digitMap.forEach((digit, word) => {
      if (subLine.startsWith(word) || subLine.startsWith(digit)) {
        newLine.push(digit);
      }
    });
  }
  return newLine.join("");
};

const extractFirstAndLastDigits = (line: string) => {
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
};

const partOne = async () => {
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

partOne()
  .then((solution) => console.log(solution))
  .catch((err) => console.error(err));

const partTwo = async () => {
  const input = (await readFile("./day-one/input.txt", "utf-8")).split("\n");
  const numbers = input
    .map(replaceSingleDigitWordsWithNumbers)
    .map(extractFirstAndLastDigits);
  return numbers.reduce((a, b) => a + b);
};

partTwo()
  .then((solution) => console.log(solution))
  .catch((err) => console.error(err));
