import Konva from "konva";
import { nanoid } from "nanoid";
import { useEffect, useRef } from "react";
import { Group, Rect } from "react-konva";
import Player from "../classes/Player";
import Ship from "../classes/Ship";
import { ShipPiece, PlayersParam } from "../types/types";
import { CORNER_RADIUS, SMALL_TILE_GAP, SMALL_TILE_SIZE } from "./store";

export default function ShipHud({ players }: PlayersParam) {
  return (
    <Group x={-100}>
      {players.map((player: Player, i: number) => (
        <SmallShipGroup
          key={player.id + "-shipGroup"}
          ships={player.ships}
          color={player.color}
          gap={i * 110}
        />
      ))}
    </Group>
  );
}

export function SmallShipGroup({ ships, color, gap }: any) {
  const group = useRef<Konva.Group | null>(null);

  useEffect(() => {
    if (group.current === null) return;
    const { width, height } = group.current.getClientRect();
    group.current.offset({ x: width / 2, y: height });
  });
  // create ships for ONLY ONE PLAYER
  return (
    <Group ref={group} rotation={180} y={gap}>
      {ships.map((ship: Ship, i: number) => (
        <SmallShip
          key={ship.id}
          length={ship.length}
          color={color}
          y={i * (SMALL_TILE_SIZE + SMALL_TILE_GAP + 2)}
        />
      ))}
    </Group>
  );
}

export function SmallShip({ color, length, y }: ShipPiece) {
  const rects = [];
  for (let i = 0; i < length; i++) {
    const data = {
      id: nanoid(),
      width: SMALL_TILE_SIZE,
      height: SMALL_TILE_SIZE,
      y: 0,
      x: i * (SMALL_TILE_SIZE + SMALL_TILE_GAP),
      fill: color,
      cornerRadius: SMALL_TILE_SIZE * CORNER_RADIUS,
    };
    rects.push(<Rect key={data.id} {...data} />);
  }
  return <Group y={y}>{rects}</Group>;
}
