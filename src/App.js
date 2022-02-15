import './App.css';
import { getImage } from './components/utils/Utils'
import Game from './components/Game'

const HEIGHT = 59, WIDTH = 9
const EXPLOSION_SIZE = 2
var totalBonuses = 0

function generateRandomType(i, j) {
  let random, type
  random = Math.random()
  if (random < 0.04 && i < (HEIGHT - 2)) {
    type = "bonus"
    totalBonuses += 1
  }
  else if ((random > 0.05 && random < 0.57) || (i < 3 && j < 3))
    type = "empty"
  else if (random > 0.57 && random < 0.59)
    type = "trap"
  else if (random > 0.59 && random < 0.65)
    type = "skull"
  else
    type = "wall"
  return type
}

function generateGrid() {
  let newGrid = []
  let row
  for (let i = 0; i < HEIGHT; i++) {
    row = []
    for (let j = 0; j < WIDTH; j++) {
      let type = generateRandomType(i, j)
      let img = getImage(type)
      let cell = {
        "img": img,
        "type": type,
        "x": i,
        "y": j
      }
      row.push(cell)
    }
    newGrid.push(row);
  }
  return newGrid;
}

function App() {
  const grid = generateGrid()

  return (
    <Game grid={grid} HEIGHT={HEIGHT} WIDTH={WIDTH}
      EXPLOSION_SIZE={EXPLOSION_SIZE} totalBonuses={totalBonuses} />
  );
}

export default App;
