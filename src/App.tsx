import { useEffect, useState } from "react";
import Gameboard from "./ts/classes/Gameboard";
import Ship from "./ts/classes/Ship";

const gameboard = new Gameboard({ length: [10, 20] });
function App() {
  const [grid, setGrid] = useState(gameboard.grid);

  const addAShip = () => {
    gameboard.placeShipRandom(new Ship(Math.floor(Math.random() * 0) + 3));
    setGrid([...gameboard.grid]);
    console.log(gameboard.showBoard());
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
            <div data-coord={JSON.stringify({ y, x })} className={tile === "s" ? "ship" : "tile"} key={`${y}, ${x}`}>
              {tile}
            </div>
          ));
        })}
      </div>
      <button onClick={addAShip}>Add A Ship</button>
      <button onClick={resetGrid}> Reset board</button>
    </div>
  );
}

export default App;
