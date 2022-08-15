import { nanoid } from "nanoid";
import { useEffect, useState } from "react";
import { Layer, Rect, Stage } from "react-konva";
import AI from "./ts/classes/AI";
import Coord from "./ts/classes/Coord";
import Gameboard from "./ts/classes/Gameboard";
import Player from "./ts/classes/Player";
import Ship from "./ts/classes/Ship";
import { Grid, MARKS } from "./ts/types/types";
const gameboard = new Gameboard({ boardLength: [20, 20] });
gameboard.addPlayer(new AI("bot1"), new AI("bot2"), new AI("bot3"));
gameboard.players.forEach((p) => {
  p.ships.forEach((s) => gameboard.placeShipRandom(s));
});
function generateTiles() {
  return gameboard.grid.flatMap((row, y) => {
    return row.flatMap((tile, x) => {
      return {
        id: nanoid(),
        y: y * 28,
        x: x * 28,
        color: tile === MARKS.SHIP ? colors.ship : colors.water,
        hover: false,
        coord: new Coord(y, x),
        hit: false,
      };
    });
  });
}

const colors = {
  water: "#211f9e",
  ship: "#d6bb36",
  hover: "#ab4ceb",
  attack: "#ff3333",
};

const player = new Player("weibo");
function App() {
  const [grid, setGrid] = useState(generateTiles());
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
              fill={tile.hover ? colors.hover : tile.color}
              id={tile.id}
              onMouseEnter={handleEvent}
              onMouseLeave={mouseOut}
              onClick={attack}
            />
          ))}
        </Layer>
      </Stage>
    </div>
  );
}

function GameGrid({ grid, shrink }: { grid: Grid; shrink: boolean }) {
  return (
    <div className={`grid ${shrink ? "shrink" : ""}`}>
      {grid.map((row, y) => {
        return row.map((tile, x) => (
          <div
            data-coord={JSON.stringify({ y, x })}
            className={tile === "s" ? "ship" : "tile"}
            key={`${y}, ${x}`}
          ></div>
        ));
      })}
    </div>
  );
}

export default App;
