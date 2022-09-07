import Konva from "konva";
import { nanoid } from "nanoid";
import React from "react";
import { Group, Rect } from "react-konva";
import { DEFAULT_TILE_FILL, DEFAULT_TILE_STROKE, PLAYER_COLORS } from "../types/types";
import { CORNER_RADIUS, TILE_GAP, TILE_SIZE } from "./store";

const SetupShip = React.forwardRef<Konva.Group | null>((props, ref) => {
  // should I edit the gameboard state? Or should I have a fake one?
  // need to get player ships.
  // hm.

  const fakeShip: any[] = [];
  for (let i = 0; i < 3; i++) {
    fakeShip.push(
      <Rect
        key={nanoid()}
        y={i * (TILE_SIZE + TILE_GAP)}
        x={0}
        width={TILE_SIZE}
        height={TILE_SIZE}
        fill={PLAYER_COLORS[3]}
        stroke={DEFAULT_TILE_STROKE}
        cornerRadius={CORNER_RADIUS * TILE_SIZE}
      />
    );
  }
  return <Group ref={ref}>{fakeShip}</Group>;
  // try fake one first
});

export default SetupShip;
