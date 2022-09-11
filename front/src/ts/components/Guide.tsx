import { Group, Text } from "react-konva";
import { TILE_GAP, TILE_SIZE } from "./store";
import { GuideTypes } from "../types/types";
import { nanoid } from "nanoid";

export default function Guide({ length, isAlphabet }: GuideTypes) {
  let guides: any[] = [];
  for (let i = 0; i < length; i++) {
    guides.push({
      id: nanoid(),
      text: isAlphabet ? String.fromCharCode(65 + i) : i + 1,
      y: isAlphabet ? i * (TILE_SIZE + TILE_GAP) : -TILE_SIZE,
      x: isAlphabet ? -TILE_SIZE : i * (TILE_SIZE + TILE_GAP),
    });
  }

  return (
    <Group>
      {guides.map((guide) => (
        <Text
          key={guide.id}
          text={guide.text}
          y={guide.y}
          x={guide.x}
          fontSize={16}
          fontStyle={"500"}
          fontFamily={"Lexend"}
          fill="#AAAAAA"
          align="center"
          verticalAlign="middle"
          width={TILE_SIZE}
          height={TILE_SIZE}
        />
      ))}
    </Group>
  );
}
