import { nanoid } from "nanoid";

// Konva
import Konva from "konva";
import { KonvaEventObject } from "konva/lib/Node";
import { Shape } from "konva/lib/Shape";
import { RectConfig } from "konva/lib/shapes/Rect";
import { Group, Layer, Rect, Stage, Text, useStrictMode } from "react-konva";

// classes
import AI from "./ts/classes/AI";
import Coord from "./ts/classes/Coord";
import Gameboard from "./ts/classes/Gameboard";

//types
import { DEFAULT_TILE_FILL, DEFAULT_TILE_STROKE, PLAYER_COLORS, TileData } from "./ts/types/types";

// components
import useGameStore, {
  CORNER_RADIUS,
  GUIDE_SIZE,
  TILE_GAP,
  TILE_SIZE,
} from "../src/ts/components/store";
import ShipHud from "./ts/components/ShipHud";
import Guide from "./ts/components/Guide";
import React, { LegacyRef, useEffect, useRef } from "react";
import SetupShip from "./ts/components/SetupShip";

useStrictMode(true);

/**
 *
 *
 * Fake Server
 *
 *
 */
const gameboard = new Gameboard({ boardLength: [15, 20] });
gameboard.addPlayer(new AI("bot1"), new AI("bot2"), new AI("bot3"), new AI("bot4"));
gameboard.players.forEach((p) => {
  p.ships.forEach((s) => gameboard.placeShipRandom(s));
});

/**
 *
 * CODE
 *
 */

function App() {
  // const [stage, setStage] = useState({ width: window.innerWidth, height: window.innerHeight });

  const [gameMode, setGameMode] = useGameStore((s) => [s.gameMode, s.setGameMode]);

  return (
    <div className="app">
      <Stage className="konva" width={window.innerWidth} height={window.innerHeight}>
        <Layer>
          <Board dimension={{ x: 20, y: 15 }} />
        </Layer>
      </Stage>
      <button onClick={() => setGameMode("board_setup")}>Place Ship</button>
    </div>
  );
}

function Board({ dimension }: any) {
  const board = useGameStore((state) => state.board);
  const [gameMode, setGameMode] = useGameStore((s) => [s.gameMode, s.setGameMode]);
  const fakeShipRef = useRef<Konva.Group | null>(null);
  useEffect(() => {
    // console.log(fakeShipRef);
  });
  // const board: TileData[] = [];
  // for (let y = 0; y < dimension.y; y++) {
  //   for (let x = 0; x < dimension.x; x++) {
  //     const tile = {
  //       id: nanoid(),
  //       coord: new Coord(y, x),
  //       y: y * (TILE_SIZE + TILE_GAP),
  //       x: x * (TILE_SIZE + TILE_GAP),
  //       width: TILE_SIZE,
  //       height: TILE_SIZE,
  //       fill: "#353535",
  //       cornerRadius: TILE_SIZE * CORNER_RADIUS,
  //       stroke: "#3c3c3c",
  //     };

  //     board.push(tile);
  //   }
  // }

  const mouseOver = (e: KonvaEventObject<MouseEvent>) => {
    const rect: Shape<RectConfig> | Konva.Stage = e.target;
    if (typeof rect === typeof Konva.Stage) return;

    if (gameMode === "board_setup") {
      const { y, x } = e.target.attrs;
      fakeShipRef.current?.x(x);
      fakeShipRef.current?.y(y);
    }
    rect.setAttr("fill", "#505050");
    document.body.style.cursor = "pointer";
  };

  const mouseOut = (e: KonvaEventObject<MouseEvent>) => {
    const rect: Shape<RectConfig> | Konva.Stage = e.target;
    if (typeof rect === typeof Konva.Stage) return;
    rect.setAttr("fill", DEFAULT_TILE_FILL);
    document.body.style.cursor = "default";
  };
  return (
    <Group
      offsetY={(dimension.y * (TILE_SIZE + TILE_GAP)) / 2}
      offsetX={(dimension.x * (TILE_SIZE + TILE_GAP)) / 2}
      y={(window.innerHeight + GUIDE_SIZE) / 2}
      x={(window.innerWidth + GUIDE_SIZE) / 2}
    >
      <Guide length={dimension.x} isAlphabet={false} />
      <Guide length={dimension.y} isAlphabet />
      <Group onMouseOver={mouseOver} onMouseOut={mouseOut}>
        {board.map((row) =>
          row.map((tile: TileData) => (
            <Rect
              key={tile.id}
              {...tile}
              width={TILE_SIZE}
              height={TILE_SIZE}
              cornerRadius={CORNER_RADIUS * TILE_SIZE}
            />
          ))
        )}
      </Group>
      <SetupShip ref={fakeShipRef} />

      <ShipHud players={gameboard.players} />
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
