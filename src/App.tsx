import { nanoid } from "nanoid";
import { useEffect, useState } from "react";
import { Group, Layer, Rect, Stage } from "react-konva";
import AI from "./ts/classes/AI";
import Coord from "./ts/classes/Coord";
import Gameboard from "./ts/classes/Gameboard";
import Player from "./ts/classes/Player";
import Ship from "./ts/classes/Ship";
import { Grid, MARKS, MarkTypes } from "./ts/types/types";
const gameboard = new Gameboard({ boardLength: [20, 20] });
gameboard.addPlayer(new AI("bot1"), new AI("bot2"), new AI("bot3"));
// gameboard.players.forEach((p) => {
//   p.ships.forEach((s) => gameboard.placeShipRandom(s));
// });

// all the gameboard data, game data will be stored on server side
// the data that should only be displayed here is the grid
// players information
//
function generateTiles() {
  return gameboard.grid.flatMap((row, y) => {
    return row.flatMap((tile, x) => {
      return {
        id: nanoid(),
        y: y * 28,
        x: x * 28,
        color: tile === MARKS.SHIP ? COLORS.ship : COLORS.water,
        hover: false,
        state: tile,
        coord: new Coord(y, x),
        hit: false,
      };
    });
  });
}

interface TileData {
  y: number;
  x: number;
  color: string;
  hover: boolean;
  hit: boolean;
  state: string;
  id: string;
}

const COLORS = {
  water: "#211f9e",
  ship: "#d6bb36",
  hover: "#ab4ceb",
  attack: "#ff3333",
};

const TILE_SIZE = 25;
const GRID_WIDTH = 28 * gameboard.length[0];

const INITIAL_STATE = generateTiles();
const player = new Player("weibo");
function App() {
  const [grid, setGrid] = useState(INITIAL_STATE);
  const handleEvent = (e) => {
    setGrid((prev) => {
      return prev.map((tile) => ({
        ...tile,
        hover: tile.id === e.target.id() ? true : false,
      }));
    });
    const container = e.target.getStage().container();
    container.style.cursor = "pointer";
  };

  function mouseOut(e) {
    const container = e.target.getStage().container();
    container.style.cursor = "default";
  }

  function attack(e) {
    const id = e.target.id();
    const tile = grid.find((tile) => tile.id === id);
    console.log(player.attack(gameboard, gameboard, tile?.coord));
  }
  return (
    <div className="app">
      <div>{gameboard.showBoard()}</div>
      <Stage width={window.innerWidth} height={window.innerHeight}>
        <Layer>
          {grid.map((tile) => (
            <Rect
              key={tile.id}
              x={tile.x}
              y={tile.y}
              width={25}
              height={25}
              fill={tile.hover ? COLORS.hover : tile.color}
              id={tile.id}
              onMouseEnter={handleEvent}
              onMouseLeave={mouseOut}
              onClick={attack}
            />
          ))}
          <Ships length={4} />
          <Ships length={3} />
          <Ships length={5} />
          <Ships length={3} />
          <Ships length={2} />
        </Layer>
      </Stage>
    </div>
  );
}

function Ships({ length }: { length: number }) {
  return (
    <Group
      draggable
      onDragEnd={(e) => {
        e.target.to({
          x: Math.round(e.target.x() / TILE_SIZE) * (TILE_SIZE + 3),
          y: Math.round(e.target.y() / TILE_SIZE) * (TILE_SIZE + 3),
          duration: 0.1,
        });
      }}
    >
      {[...Array(length)].map((_, i) => {
        const props = {
          id: nanoid(),
          x: 0 + i * 28,
          y: 0,
          hover: false,
          state: MARKS.SHIP,
          hit: false,
          color: COLORS.ship,
        };
        return <Tile key={props.id} {...props} />;
      })}
    </Group>
  );
}

function Tile(tile: TileData) {
  return (
    <Rect
      // key={tile.id}
      x={tile.x}
      y={tile.y}
      width={25}
      height={25}
      fill={tile.hover ? COLORS.hover : tile.color}
      id={tile.id}
    />
  );
}
export default App;
