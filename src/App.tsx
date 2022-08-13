import { useEffect, useState } from "react";
import AI from "./ts/classes/AI";
import Gameboard from "./ts/classes/Gameboard";
import Ship from "./ts/classes/Ship";
const gameboard = new Gameboard({ boardLength: [10, 10] });
function App() {
  const [grid, setGrid] = useState(gameboard.grid);

  const addAShip = () => {
    setGrid([...gameboard.grid]);
    const ai = new AI("bot1");
    // ai.addShip(new Ship(Math.floor(Math.random() * 5) + 1));
    ai.ships.forEach((s) => gameboard.placeShipRandom(s));
    gameboard.addPlayer(ai);

    console.log(gameboard.showBoard());
  };

  const attackRandom = () => {
    gameboard.getCurrentPlayer().attack(gameboard, gameboard);
    setGrid([...gameboard.grid]);
  };

  const resetGrid = () => {
    gameboard.resetBoard();
    setGrid([...gameboard.grid]);
  };
  useEffect(() => {
    // console.log(gameboard.showBoard());
  });
  return (
    <div className="App">
      <div>{JSON.stringify(grid)}</div>
      <div className="grid">
        {grid.map((row, y) => {
          return row.map((tile, x) => (
            <div
              data-coord={JSON.stringify({ y, x })}
              className={tile === "s" ? "ship" : "tile"}
              key={`${y}, ${x}`}
            >
              {tile}
            </div>
          ));
        })}
      </div>
      <button onClick={addAShip}>Add A Ship</button>
      <button onClick={resetGrid}> Reset board</button>
      <button onClick={attackRandom}> attack board</button>
    </div>
  );
}

export default App;
