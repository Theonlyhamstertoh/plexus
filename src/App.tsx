import { useEffect, useState } from "react";
import Gameboard from "./ts/classes/Gameboard";
import Ship from "./ts/classes/Ship";

function App() {
  const [gameboard, setGameboard] = useState(new Gameboard({ length: [10, 10] }));

  useEffect(() => {
    gameboard.placeShipRandom(new Ship(3));
  }, []);

  return (
    <div className="App">
      <div className="grid">
        {gameboard.grid.map((row, i) => {
          return row.map((column, colI) => (
            <div className="tile" key={`${i}, ${colI}`}>
              ({i},{colI})
            </div>
          ));
        })}
      </div>
    </div>
  );
}

export default App;
