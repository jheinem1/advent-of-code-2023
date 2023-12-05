import { readFile } from "fs/promises";

interface EngineSchematic {
  symbols: Symbol[];
  partNumbers: PartNumber[];
}

interface Symbol {
  position: Position;
  value: string;
}

interface PartNumber {
  position: Position;
  xSize: number;
  value: number;
}

interface Position {
  x: number;
  y: number;
}

const parseEngineSchematic = (unparsedSchematic: string[]): EngineSchematic => {
  const schematic: EngineSchematic = {
    symbols: [],
    partNumbers: [],
  };
  let i = 0;
  for (const line of unparsedSchematic) {
    const symbolMatches = line.matchAll(/[^\d\w\s\.]/g);
    for (const symbolMatch of symbolMatches) {
      if (symbolMatch.index !== undefined && symbolMatch[0]) {
        schematic.symbols.push({
          position: { x: symbolMatch.index, y: i },
          value: symbolMatch[0],
        });
      }
    }
    const numberMatches = line.matchAll(/\d+/g);
    for (const numberMatch of numberMatches) {
      if (numberMatch.index !== undefined && numberMatch[0]) {
        schematic.partNumbers.push({
          position: { x: numberMatch.index, y: i },
          xSize: numberMatch[0].length,
          value: parseInt(numberMatch[0]),
        });
      }
    }
    i++;
  }
  return schematic;
};

const isValidPartNumber = (partNumber: PartNumber, symbols: Symbol[]) => {
  for (const symbol of symbols) {
    if (symbol.position.y === partNumber.position.y) {
      if (
        symbol.position.x === partNumber.position.x - 1 ||
        symbol.position.x === partNumber.position.x + partNumber.xSize
      ) {
        return true;
      }
    } else if (
      symbol.position.y === partNumber.position.y - 1 ||
      symbol.position.y === partNumber.position.y + 1
    ) {
      if (
        symbol.position.x >= partNumber.position.x - 1 &&
        symbol.position.x <= partNumber.position.x + partNumber.xSize
      ) {
        return true;
      }
    }
  }
  return false;
};

const partOne = async () => {
  const input = (await readFile("./day-three/input.txt", "utf-8")).split("\n");
  const { symbols, partNumbers } = parseEngineSchematic(input);
  const validPartNumbers = partNumbers.filter((partNumber) =>
    isValidPartNumber(partNumber, symbols)
  );
  return validPartNumbers
    .map((partNumber) => partNumber.value)
    .reduce((a, b) => a + b);
};

partOne()
  .then((solution) => console.log(solution))
  .catch((err) => console.error(err));
