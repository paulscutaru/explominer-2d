import { useState, useReducer } from "react";
import { Container, Row, Col } from 'react-bootstrap'
import Cell from './Cell'

const HEIGHT = 60, WIDTH = 10
const EXPLOSION_SIZE = 2
var totalBonuses = 0

function generateRandomType(i, j) {
    let random, type
    random = Math.random()
    if (random < 0.02) {
        type = "bonus"
        totalBonuses += 1
    }
    else if ((random > 0.02 && random < 0.65) || (i < 3 && j < 3))
        type = "empty"
    else if (random > 0.65 && random < 0.70)
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
            return "trap.png"
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
            let info = { "img": img, "type": type, "x": i, "y": j }
            row.push(info)
        }
        newGrid.push(row);
    }
    return newGrid;
}


function Grid() {
    const [grid, setGrid] = useState(GenerateGrid())
    const [currentCell, setCurrentCell] = useState(grid[0][0])
    const [buttonBombEnabled, setButtonBombEnabled] = useState(true)
    const [gameStarted, setGameStarted] = useState(false)
    const [gameOver, setGameOver] = useState(false)
    const [bonus, setBonus] = useState(0)
    const [bombs, setBombs] = useState(totalBonuses + 5)
    const forceUpdate = useReducer(() => ({}))[1]

    function canMove(x, y) {
        if (x < 0 || y < 0 || x >= HEIGHT || y >= WIDTH || grid[x][y].type === "wall")
            return false
        return true
    }

    function explodeBomb() {
        let x = currentCell.x, y = currentCell.y, explosionImage = getImage("explosion"), emptyImage = getImage("empty")

        grid[x][y].type = "explosion"
        grid[x][y].img = explosionImage

        for (let i = 1; i <= EXPLOSION_SIZE; i++) {
            if ((x + i) < HEIGHT) {
                grid[x + i][y].type = "explosion"
                grid[x + i][y].img = explosionImage
            }
            if ((x - i) >= 0) {
                grid[x - i][y].type = "explosion"
                grid[x - i][y].img = explosionImage
            }
            if ((y - i) >= 0) {
                grid[x][y - i].type = "explosion"
                grid[x][y - i].img = explosionImage
            }
            if ((y + i) < WIDTH) {
                grid[x][y + i].type = "explosion"
                grid[x][y + i].img = explosionImage
            }
        }
        setTimeout(() => {
            grid[x][y].type = "empty"
            grid[x][y].img = emptyImage
            for (let i = 1; i <= EXPLOSION_SIZE; i++) {
                if ((x + i) < HEIGHT) {
                    grid[x + i][y].type = "empty"
                    grid[x + i][y].img = emptyImage
                }
                if ((x - i) >= 0) {
                    grid[x - i][y].type = "empty"
                    grid[x - i][y].img = emptyImage
                }
                if ((y - i) >= 0) {
                    grid[x][y - i].type = "empty"
                    grid[x][y - i].img = emptyImage
                }
                if ((y + i) < WIDTH) {
                    grid[x][y + i].type = "empty"
                    grid[x][y + i].img = emptyImage
                }
            }
            forceUpdate()
        }, 200);
    }


    function putBomb() {
        let x = currentCell.x, y = currentCell.y
        if (buttonBombEnabled) {
            setButtonBombEnabled(false)
            setBombs(bombs => bombs - 1)

            grid[x][y].type = "bomb"
            grid[x][y].img = getImage("bomb")

            setTimeout(() => {
                explodeBomb()
                setButtonBombEnabled(true)
            }, 1300);
        }
    }

    function handleMove(direction) {
        let newX = 0, newY = 0
        switch (direction) {
            case "left":
                newX = currentCell.x
                newY = currentCell.y - 1
                break;
            case "right":
                newX = currentCell.x
                newY = currentCell.y + 1
                break;
            case "up":
                newX = currentCell.x - 1
                newY = currentCell.y
                break;
            case "down":
                newX = currentCell.x + 1
                newY = currentCell.y
                break;
        }

        if (canMove(newX, newY)) {
            if (grid[newX][newY].type === "trap") {
                setGameOver(true)
            }
            if (grid[newX][newY].type === "bonus") {
                grid[newX][newY].type = "empty"
                grid[newX][newY].img = getImage("empty")
                setBonus(bonus + 1)
            }
            setCurrentCell(grid[newX][newY])
        }
    };

    function restartGame() {
        setGrid(GenerateGrid())
        setCurrentCell(grid[0][0])
        setGameOver(false)
        setBonus(0)
        setBombs(totalBonuses + 5)
        console.log("Game restarted")
    }

    return (
        <Container>
            <Container className="grid">
                {gameOver &&
                    <Container className="game-over-modal">
                        <h2>You died from poisoning!</h2>
                        <button className="button btn-restart" onMouseDown={() => restartGame()}>Restart</button>
                    </Container>
                }
                <Container className="score-container">
                    <h4>Torches: {bonus} / {totalBonuses}</h4>
                    <h4>💣{bombs}</h4>
                </Container>
                {grid.map((row, index) => (
                    <Row className="row-grid" key={index}>
                        {row.map((info, i) =>
                            <Cell key={i} info={info} currentCell={currentCell} />
                        )}
                    </Row>
                ))}
            </Container>
            {!gameOver &&
                <Container className="controls" >
                    <Row>
                        <Col>
                            <button className="button" onMouseDown={() => handleMove("up")}>↑</button>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <button className="button" onMouseDown={() => handleMove("left")}>←</button>
                            <button className="button" onMouseDown={() => handleMove("down")}>↓</button>
                            <button className="button" onMouseDown={() => handleMove("right")}>→</button>
                        </Col>
                        <Col>
                            <button style={{ visibility: buttonBombEnabled ? 'visible' : 'hidden' }} className="button btn-bomb"
                                onMouseDown={() => putBomb()}>
                                💣
                            </button>
                        </Col>
                    </Row>
                </Container>
            }
        </Container>
    );
}

export default Grid;