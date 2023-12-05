import { readFile } from "fs/promises";

interface Game {
  id: number;
  rounds: Round[];
}

interface Round {
  red: number;
  green: number;
  blue: number;
}

const parseGame = (line: string): Game => {
  const match = line.match(/^Game (\d+): ([\w\d\s,;]*)/);
  const gameId = match?.[1];
  const rounds = match?.[2];
  return {
    id: parseInt(gameId ?? "-1"),
    rounds: rounds?.split(";").map(parseRound) ?? [],
  };
};

const parseRound = (line: string): Round => {
  const redMatch = line.match(/(\d+) red/);
  const greenMatch = line.match(/(\d+) green/);
  const blueMatch = line.match(/(\d+) blue/);
  return {
    red: parseInt(redMatch?.[1] ?? "0"),
    green: parseInt(greenMatch?.[1] ?? "0"),
    blue: parseInt(blueMatch?.[1] ?? "0"),
  };
};

const maximumCubesFromGame = (game: Game): Round => {
  const maxCubes = {
    red: 0,
    green: 0,
    blue: 0,
  };
  for (const round of game.rounds) {
    maxCubes.red = Math.max(maxCubes.red, round.red);
    maxCubes.green = Math.max(maxCubes.green, round.green);
    maxCubes.blue = Math.max(maxCubes.blue, round.blue);
  }
  return maxCubes;
};

const isPossible = (possibility: Round, game: Game): boolean => {
  const maxCubes = maximumCubesFromGame(game);
  if (
    possibility.red >= maxCubes.red &&
    possibility.green >= maxCubes.green &&
    possibility.blue >= maxCubes.blue
  ) {
    return true;
  }
  return false;
};

const partOne = async (possibleCubes: Round) => {
  const input = (await readFile("./day-two/input.txt", "utf-8")).split("\n");
  const games = input.map(parseGame);
  const possibleGames = games.filter((game) => isPossible(possibleCubes, game));
  return possibleGames.map((game) => game.id).reduce((a, b) => a + b, 0);
};

partOne({
  red: 12,
  green: 13,
  blue: 14,
})
  .then((solution) => console.log(solution))
  .catch((err) => console.error(err));

const partTwo = async () => {
  const input = (await readFile("./day-two/input.txt", "utf-8")).split("\n");
  const games = input.map(parseGame);
  const maxCubesFromGames = games.map(maximumCubesFromGame);
  const powerMaxCubesFromGames = maxCubesFromGames.map(
    (maxCubes) => maxCubes.red * maxCubes.green * maxCubes.blue
  );
  return powerMaxCubesFromGames.reduce((a, b) => a + b);
};

partTwo()
  .then((solution) => console.log(solution))
  .catch((err) => console.error(err));
