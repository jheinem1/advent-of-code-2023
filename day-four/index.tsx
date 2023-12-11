import { readFile } from "fs/promises";

const partOne = async () => {
  const input = (await readFile("./day-four/input.txt", "utf-8")).split("\n");
};

partOne()
  .then((solution) => console.log(solution))
  .catch((err) => console.error(err));
