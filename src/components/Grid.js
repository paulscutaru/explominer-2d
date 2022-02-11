import { useState, useReducer } from "react";
import { Container, Row, Col } from 'react-bootstrap'
import Cell from './Cell'

const HEIGHT = 17, WIDTH = 24
const EXPLOSION_SIZE = 2

function generateRandomType(i, j) {
    let random, type
    random = Math.random()
    if (random < 0.02)
        type = "bonus"
    else if ((random > 0.1 && random < 0.8) || (i < 3 && j < 3))
        type = "empty"
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
    }
}

function GenerateGrid() {
    let grid = []
    let row
    for (let i = 0; i < HEIGHT; i++) {
        row = []
        for (let j = 0; j < WIDTH; j++) {
            let type = generateRandomType(i, j)
            let img = getImage(type)
            let info = { "img": img, "type": type, "x": i, "y": j }
            row.push(info)
        }
        grid.push(row);
    }
    return grid;
}

function Grid() {
    const [grid, setGrid] = useState(GenerateGrid())
    const [currentCell, setCurrentCell] = useState(grid[0][0])
    const [buttonBombEnabled, setButtonBombEnabled] = useState(true)
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
            if ((x + i) <= HEIGHT) {
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
            if ((y + i) <= WIDTH) {
                grid[x][y + i].type = "explosion"
                grid[x][y + i].img = explosionImage
            }
        }
        setTimeout(() => {
            grid[x][y].type = "empty"
            grid[x][y].img = emptyImage
            for (let i = 1; i <= EXPLOSION_SIZE; i++) {
                if ((x + i) <= HEIGHT) {
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
                if ((y + i) <= WIDTH) {
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
            console.log("Bomb put at", grid[x][y])

            setButtonBombEnabled(false)

            grid[x][y].type = "bomb"
            grid[x][y].img = getImage("bomb")

            setTimeout(() => {
                explodeBomb()
                setButtonBombEnabled(true)
            }, 1400);
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

        console.log("last", currentCell)

        if (canMove(newX, newY)) {
            console.log("current", grid[newX][newY])
            setCurrentCell(grid[newX][newY])
        }
    };

    return (
        <Container>
            <Container className="grid">
                {grid.map((row, index) => (
                    <Row className="row-grid" key={index}>
                        {row.map((info, i) =>
                            <Cell key={i} info={info} currentCell={currentCell} />
                        )}
                    </Row>
                ))}
            </Container>
            <Container className="controls">
                <Row>
                    <button className="button" onClick={() => handleMove("up")}>↑</button>
                </Row>
                <Row>
                    <button className="button" onClick={() => handleMove("left")}>←</button>
                    <button className="button" onClick={() => handleMove("down")}>↓</button>
                    <button className="button" onClick={() => handleMove("right")}>→</button>
                </Row>
                <Row>
                    {buttonBombEnabled &&
                        <button className="button btn-bomb" onClick={() => putBomb()}>
                            <img src={process.env.PUBLIC_URL + "/images/bomb_empty.png"} />
                        </button>}
                </Row>
            </Container>
        </Container>
    );
}

export default Grid;