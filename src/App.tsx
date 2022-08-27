import Konva from "konva";
import { Container } from "konva/lib/Container";
import { KonvaEventObject } from "konva/lib/Node";
import { Shape } from "konva/lib/Shape";
import { RectConfig } from "konva/lib/shapes/Rect";
import { nanoid } from "nanoid";
import { forwardRef, useEffect, useRef, useState } from "react";
import { Group, Layer, Rect, Stage, Text, useStrictMode } from "react-konva";
import AI from "./ts/classes/AI";
import Coord from "./ts/classes/Coord";
import Gameboard from "./ts/classes/Gameboard";
import Player from "./ts/classes/Player";
import Ship from "./ts/classes/Ship";
import { checkPositionsIfValid } from "./ts/helpers/matrixValidator";
import { createShipPositions } from "./ts/helpers/shipUtilities";
import {
  Directions,
  Grid,
  MARKS,
  MarkSymbols,
  TileData,
  COLORS,
  GuideTypes,
} from "./ts/types/types";

useStrictMode(true);
const gameboard = new Gameboard({ boardLength: [20, 20] });

gameboard.addPlayer(new AI("bot1"), new AI("bot2"), new AI("bot3"));
gameboard.players.forEach((p) => {
  p.ships.forEach((s) => gameboard.placeShipRandom(s));
});

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

const TILE_SIZE = 50;
const TILE_GAP = 5;

const INITIAL_STATE = generateTiles();
const player = new Player("weibo");

function App() {
  const [stage, setStage] = useState({ width: window.innerWidth, height: window.innerHeight });
  return (
    <div className="app">
      <Stage className="konva" width={window.innerWidth} height={window.innerHeight}>
        <Layer>
          <Board dimension={{ x: 20, y: 10 }} />
        </Layer>
      </Stage>
    </div>
  );
}

function Board({ dimension }: any) {
  const board: TileData[] = [];
  for (let y = 0; y < dimension.y; y++) {
    for (let x = 0; x < dimension.x; x++) {
      const tile = {
        id: nanoid(),
        coord: new Coord(y, x),
        y: y * (TILE_SIZE + TILE_GAP),
        x: x * (TILE_SIZE + TILE_GAP),
        width: 50,
        height: 50,
        fill: "#353535",
        cornerRadius: 8,
        stroke: "#3c3c3c",
      };

      board.push(tile);
    }
  }

  return (
    <Group
      offsetY={(dimension.y * (TILE_SIZE + TILE_GAP)) / 2}
      offsetX={(dimension.x * (TILE_SIZE + TILE_GAP)) / 2}
      y={window.innerHeight / 2}
      x={window.innerWidth / 2}
    >
      <Guide length={dimension.x} />
      <Guide length={dimension.y} isAlphabet />
      <Group
        onMouseOver={(e: KonvaEventObject<MouseEvent>) => {
          const rect: Shape<RectConfig> | Konva.Stage = e.target;
          if (typeof rect === typeof Konva.Stage) return;
          rect.setAttr("fill", "#505050");
          document.body.style.cursor = "pointer";
        }}
        onMouseOut={(e: KonvaEventObject<MouseEvent>) => {
          const rect: Shape<RectConfig> | Konva.Stage = e.target;
          if (typeof rect === typeof Konva.Stage) return;
          rect.setAttr("fill", "#353535");
          document.body.style.cursor = "default";
        }}
      >
        {board.map((tile: TileData) => (
          <Rect key={tile.id} {...tile} />
        ))}
      </Group>
    </Group>
  );
}

function Guide({ length, isAlphabet }: GuideTypes) {
  let guides: any[] = [];
  for (let i = 0; i < length; i++) {
    guides.push({
      id: nanoid(),
      text: isAlphabet ? String.fromCharCode(65 + i) : i + 1,
      y: isAlphabet ? i * (TILE_SIZE + TILE_GAP) : -50,
      x: isAlphabet ? -50 : i * (TILE_SIZE + TILE_GAP),
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
/**
 * Create numbers on the side?
 */

// function PrevApp() {
//   const [grid, setGrid] = useState(INITIAL_STATE);
//   const [direction, setDirection] = useState<Directions>("down");
//   const rect = useRef<typeof Rect>();
//   const [activeShip, setActiveShip] = useState<Coord[] | null>(4);
//   const handleEvent = (e) => {
//     const y = Math.floor(e.currentTarget.getPointerPosition().y / TILE_SIZE) * TILE_SIZE;
//     const x = Math.floor(e.currentTarget.getPointerPosition().x / TILE_SIZE) * TILE_SIZE;
//     // prevent thousands of calls on one small mouse movement
//     // if direction === down, then it no longer applies
//     if (x <= GRID_WIDTH - activeShip * TILE_SIZE && x >= 0) rect.current.x(x);
//     if (y <= GRID_WIDTH - activeShip * TILE_SIZE && y >= 0) rect.current.y(y);
//     const coordY = Math.floor(e.currentTarget.getPointerPosition().y / TILE_SIZE);
//     const coordX = Math.floor(e.currentTarget.getPointerPosition().x / TILE_SIZE);
//     const positions = createShipPositions(direction, new Coord(y, x), 4);
//     console.log(checkPositionsIfValid(direction, new Coord(coordY, coordX), 4, gameboard.grid));
//     // setGrid((prev) => {
//     //   return prev.map((row) =>
//     //     row.map((tile) => {
//     //       let hover = false;
//     //       positions.forEach((coord) => {
//     //         if (coord.x === tile.coord.x && coord.y === tile.coord.y) {
//     //           hover = true;
//     //           // only the hovered one returns true
//     //           console.log(e.target.id(), tile.id);
//     //         }
//     //       });

//     //       return { ...tile, color: hover ? COLORS.hover : COLORS.water };
//     //     })
//     //   );
//     // });
//     const container = e.target.getStage().container();
//     container.style.cursor = "crosshair";
//   };

//   return (
//     <div className="app">
//       <div>{gameboard.showBoard()}</div>
//       <Stage
//         onMouseMove={(e) => handleEvent(e)}
//         width={window.innerWidth}
//         height={window.innerHeight}
//       >
//         <Layer>
//           {grid.map((row) =>
//             row.map((tile) => (
//               <Rect
//                 key={tile.id}
//                 x={tile.x}
//                 y={tile.y}
//                 width={25}
//                 height={25}
//                 fill={tile.hover ? COLORS.hover : tile.color}
//                 id={tile.id}
//               />
//             ))
//           )}
//           {/* <Rect width={25} height={25} ref={rect} fill="#ffffff" /> */}
//           <ActiveShip length={activeShip} ref={rect} direction={direction} />
//         </Layer>
//       </Stage>
//     </div>
//   );
// }

// const ActiveShip = forwardRef((props, ref) => {
//   const tiles = [];
//   console.log(ref);
//   for (let i = 0; i < props.length; i++) {
//     tiles.push({
//       id: nanoid(),
//       y: i * TILE_SIZE,
//       x: 0,
//       hover: true,
//     });
//   }

//   return (
//     <Group ref={ref}>
//       {tiles.map((tile) => (
//         <Tile key={tile.id} {...tile} />
//       ))}
//     </Group>
//   );
// });
// function Ships({ length, positions }: { length: number; positions: Coord[] }) {
//   return (
//     <Group>
//       {positions.map((pos, i) => {
//         const props = {
//           id: nanoid(),
//           x: pos.x * TILE_SIZE,
//           y: pos.y * TILE_SIZE,
//           hover: false,
//           state: MARKS.SHIP,
//           hit: false,
//           color: COLORS.ship,
//           coord: pos,
//         };
//         return <Tile key={props.id} {...props} />;
//       })}
//     </Group>
//   );
// }

// function Tile(tile: any) {
//   return (
//     <Rect
//       x={tile.x}
//       y={tile.y}
//       width={25}
//       height={25}
//       fill={tile.hover ? COLORS.hover : tile.color}
//       id={tile.id}
//       shadowEnabled
//       shadowOpacity={0.5}
//       shadowBlur={10}
//       shadowColor={"#958021"}
//     />
//   );
// }

export default App;
