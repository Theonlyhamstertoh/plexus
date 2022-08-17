import Konva from "konva";
import { nanoid } from "nanoid";
import { forwardRef, useEffect, useRef, useState } from "react";
import { Group, Layer, Rect, Stage } from "react-konva";
import AI from "./ts/classes/AI";
import Coord from "./ts/classes/Coord";
import Gameboard from "./ts/classes/Gameboard";
import Player from "./ts/classes/Player";
import Ship from "./ts/classes/Ship";
import { createShipPositions } from "./ts/helpers/shipUtilities";
import { Directions, Grid, MARKS, MarkSymbols, TileData, COLORS } from "./ts/types/types";

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
  const grid: TileData[][] = [];
  for (let y = 0; y < gameboard.length[0]; y++) {
    grid[y] = [];
    for (let x = 0; x < gameboard.length[1]; x++) {
      grid[y][x] = createTileData(gameboard.grid[y][x], y, x);
    }
  }
  return grid;
}
function createTileData(tile: MarkSymbols, y: number, x: number) {
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
}

const TILE_SIZE = 28;
const GRID_WIDTH = 28 * gameboard.length[0];

const INITIAL_STATE = generateTiles();
const player = new Player("weibo");
function App() {
  const [grid, setGrid] = useState(INITIAL_STATE);
  const [direction, setDirection] = useState<Directions>("right");
  const rect = useRef<typeof Rect>();
  const [activeShip, setActiveShip] = useState<Coord[] | null>(4);
  const handleEvent = (e) => {
    // already on the specific tile. We are looking at it's coord
    const shipLength = 7;

    const y = Math.floor(e.currentTarget.getPointerPosition().y / TILE_SIZE) * TILE_SIZE;
    const x = Math.floor(e.currentTarget.getPointerPosition().x / TILE_SIZE) * TILE_SIZE;
    rect.current.x(x);
    rect.current.y(y);
    console.log(e.currentTarget.getPointerPosition().y / TILE_SIZE);
    // const positions = createShipPositions(direction, new Coord(y, x), shipLength);
    // setGrid((prev) => {
    //   return prev.map((row) =>
    //     row.map((tile) => {
    //       let hover = false;
    //       positions.forEach((coord) => {
    //         if (coord.x === tile.coord.x && coord.y === tile.coord.y) {
    //           hover = true;
    //           // only the hovered one returns true
    //           console.log(e.target.id(), tile.id);
    //         }
    //       });

    //       return { ...tile, color: hover ? COLORS.hover : COLORS.water };
    //     })
    //   );
    // });
    const container = e.target.getStage().container();
    container.style.cursor = "crosshair";
  };

  return (
    <div className="app">
      <div>{gameboard.showBoard()}</div>
      <Stage
        onMouseMove={(e) => handleEvent(e)}
        width={window.innerWidth}
        height={window.innerHeight}
      >
        <Layer>
          {grid.map((row) =>
            row.map((tile) => (
              <Rect
                key={tile.id}
                x={tile.x}
                y={tile.y}
                width={25}
                height={25}
                fill={tile.hover ? COLORS.hover : tile.color}
                id={tile.id}
              />
            ))
          )}
          {/* <Rect width={25} height={25} ref={rect} fill="#ffffff" /> */}
          <ActiveShip length={activeShip} ref={rect} direction={"right"} />
        </Layer>
      </Stage>
    </div>
  );
}

const ActiveShip = forwardRef((props, ref) => {
  const tiles = [];
  console.log(ref);
  for (let i = 0; i < props.length; i++) {
    tiles.push({
      id: nanoid(),
      x: i * TILE_SIZE,
      y: 0,
      hover: true,
    });
  }

  return (
    <Group ref={ref}>
      {tiles.map((tile) => (
        <Tile key={tile.id} {...tile} />
      ))}
    </Group>
  );
});
function Ships({ length, positions }: { length: number; positions: Coord[] }) {
  return (
    <Group>
      {positions.map((pos, i) => {
        const props = {
          id: nanoid(),
          x: pos.x * TILE_SIZE,
          y: pos.y * TILE_SIZE,
          hover: false,
          state: MARKS.SHIP,
          hit: false,
          color: COLORS.ship,
          coord: pos,
        };
        return <Tile key={props.id} {...props} />;
      })}
    </Group>
  );
}

function Tile(tile: any) {
  return (
    <Rect
      x={tile.x}
      y={tile.y}
      width={25}
      height={25}
      fill={tile.hover ? COLORS.hover : tile.color}
      id={tile.id}
      shadowEnabled
      shadowOpacity={0.5}
      shadowBlur={10}
      shadowColor={"#958021"}
    />
  );
}

export default App;
