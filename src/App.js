import './App.css';
import { useEffect, useState } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap'
import Grid from './components/Grid'

let soundtrack = new Audio(process.env.PUBLIC_URL + "/sounds/soundtrack.mp3")

const HEIGHT = 56, WIDTH = 9
const EXPLOSION_SIZE = 2

function generateRandomType(i, j) {
  let random, type
  random = Math.random()
  if (random < 0.04)
    type = "bonus"
  else if ((random > 0.04 && random < 0.56) || (i < 3 && j < 3))
    type = "empty"
  else if (random > 0.56 && random < 0.65)
    type = "trap"
  else
    type = "wall"
  return type
}

function getImage(type) {
  switch (type) {
    case "empty":
      return "cobblestone.png"
    case "wall":
      return "wall.png"
    case "bonus":
      return "bonus.png"
    case "bomb":
      return "bomb.png"
    case "explosion":
      return "explosion.png"
    case "trap":
      {
        if (Math.random() > 0.5)
          return "skull.png"
        return "trap.png"
      }

  }
}

function GenerateGrid() {
  let newGrid = []
  let row
  for (let i = 0; i < HEIGHT; i++) {
    row = []
    for (let j = 0; j < WIDTH; j++) {
      let type = generateRandomType(i, j)
      let img = getImage(type)
      let info = { "img": img, "type": type, "x": i, "y": j, "last": type }
      row.push(info)
    }
    newGrid.push(row);
  }
  return newGrid;
}



function App() {
  const [gameStarted, setGameStarted] = useState(false)
  const [grid, setGrid] = useState(GenerateGrid())

  window.scroll({
    top: 0,
    left: 0,
  });

  function startGame() {
    setGameStarted(true)
    soundtrack.play()

  }

  return (
    <Container className='game'>
      {!gameStarted &&
        <Container className="game-won-modal start">
          <img src={process.env.PUBLIC_URL + "/images/skull.png"} />
          <img src={process.env.PUBLIC_URL + "/images/player_bomb.png"} />
          <img src={process.env.PUBLIC_URL + "/images/skull.png"} />
          <h2>💣Explominer 2D💣</h2>
          <h3>How to play</h3>
          <p>• Collect all torches.</p> 
          <p>• Avoid skulls or poison.</p>
          <p>• Use bombs wisely.</p>
          <button className="button btn-restart" onMouseDown={() => startGame()}>Start</button>
        </Container>
      }
      {gameStarted &&
        <Grid grid={grid} HEIGHT={HEIGHT} WIDTH={WIDTH}
          EXPLOSION_SIZE={EXPLOSION_SIZE} />}
    </Container>
  );
}

export default App;
