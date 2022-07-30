import { useState } from "react";

function App() {
  let grid: number[][] = [];
  for (let x = 0; x < 10; x++) {
    grid[x] = [];
    for (let y = 0; y < 10; y++) {
      grid[x][y] = x * 10 + y;
    }
  }

  console.log(grid);
  return <div className="App"></div>;
}

export default App;
