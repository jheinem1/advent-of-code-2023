import { readFile } from "fs/promises";

interface EngineSchematic {
  symbols: Symbol[];
  partNumbers: PartNumber[];
}

interface Symbol {
  position: Position;
  value: string;
}

interface Gear extends Symbol {
  value: "*";
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

const isTouching = (
  position1: Position,
  position2: Position,
  position1XSize: number = 1
): boolean => {
  if (position2.y === position1.y) {
    if (
      position2.x === position1.x - 1 ||
      position2.x === position1.x + position1XSize
    ) {
      return true;
    }
  } else if (
    position2.y === position1.y - 1 ||
    position2.y === position1.y + 1
  ) {
    if (
      position2.x >= position1.x - 1 &&
      position2.x <= position1.x + position1XSize
    ) {
      return true;
    }
  }
  return false;
};

const isValidPartNumber = (
  partNumber: PartNumber,
  symbols: Symbol[]
): boolean => {
  for (const symbol of symbols) {
    if (isTouching(partNumber.position, symbol.position, partNumber.xSize)) {
      return true;
    }
  }
  return false;
};

const calculateGearRatio = (
  gear: Gear,
  partNumbers: PartNumber[]
): number | undefined => {
  let touchingParts = new Array<number>();
  for (const partNumber of partNumbers) {
    if (isTouching(partNumber.position, gear.position, partNumber.xSize)) {
      touchingParts.push(partNumber.value);
    }
  }
  return touchingParts.length > 1
    ? touchingParts.reduce((a, b) => a * b)
    : undefined;
};

const isGear = (symbol: Symbol): symbol is Gear => {
  return symbol.value === "*";
};

const isNumber = (v: unknown): v is number => {
  return typeof v === "number";
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

const partTwo = async () => {
  const input = (await readFile("./day-three/input.txt", "utf-8")).split("\n");
  const { symbols, partNumbers } = parseEngineSchematic(input);
  const gearRatios: number[] = symbols
    .filter(isGear)
    .map((gear) => calculateGearRatio(gear, partNumbers))
    .filter(isNumber);
  return gearRatios.reduce((a, b) => a + b);
};

partTwo()
  .then((solution) => console.log(solution))
  .catch((err) => console.error(err));
