import { readFile } from "fs/promises";

interface Scratchcard {
  id: number;
  winningNumbers: number[];
  cardNumbers: number[];
}

const parseScratchcard = (line: string): Scratchcard => {
  const [card, numbers] = line.split(":");
  const [winningNumbers, cardNumbers] = numbers.split("|").map(parseNumberList);
  return {
    id: parseInt(card.split(" ")[1]),
    winningNumbers,
    cardNumbers,
  };
};

const parseNumberList = (numberList: string): number[] => {
  const numbersMatch = numberList.matchAll(/\d+/g);
  const numbersList = new Array<number>();
  for (const numberMatch of numbersMatch) {
    numbersList.push(parseInt(numberMatch[0]));
  }
  return numbersList;
};

const getWinningNumbersFromScratchcard = (
  scratchcard: Scratchcard
): number[] => {
  const winningNumbers = new Array<number>();
  for (const cardNumber of scratchcard.cardNumbers) {
    for (const winningNumber of scratchcard.winningNumbers) {
      if (cardNumber === winningNumber) {
        winningNumbers.push(cardNumber);
      }
    }
  }
  return winningNumbers;
};

const calculateScore = (winningNumbers: number[]): number => {
  if (winningNumbers.length === 0) {
    return 0;
  }
  let score = 1;
  for (let i = 1; i < winningNumbers.length; i++) {
    score *= 2;
  }
  return score;
};

const partOne = async () => {
  const input = (await readFile("./day-four/input.txt", "utf-8")).split("\n");
  const scratchcards = input.map(parseScratchcard);
  console.log(scratchcards);
  const winningNumbers = scratchcards.map(getWinningNumbersFromScratchcard);
  console.log(winningNumbers);
  return winningNumbers.map(calculateScore).reduce((a, b) => a + b);
};

partOne()
  .then((solution) => console.log(solution))
  .catch((err) => console.error(err));
