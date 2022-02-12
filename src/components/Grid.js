import { useState, useReducer, useRef } from "react";
import { Container, Row, Col } from 'react-bootstrap'
import Cell from './Cell'

let explodeSound = new Audio(process.env.PUBLIC_URL + "/sounds/explode.mp3")
let bonusSound = new Audio(process.env.PUBLIC_URL + "/sounds/bonus.mp3")
let endSound = new Audio(process.env.PUBLIC_URL + "/sounds/end.mp3")
let winSound = new Audio(process.env.PUBLIC_URL + "/sounds/win.mp3")

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

function Grid(props) {
    let grid = props.grid
    let HEIGHT = props.HEIGHT
    let WIDTH = props.WIDTH
    let EXPLOSION_SIZE = props.EXPLOSION_SIZE
    var totalBonuses = 0
    for (let i = 0; i < HEIGHT; i++)
        for (let j = 0; j < WIDTH; j++)
            if (grid[i][j].last === "bonus")
                totalBonuses += 1

    const [currentCell, setCurrentCell] = useState(grid[1][1])
    const [buttonBombEnabled, setButtonBombEnabled] = useState(true)
    const gameOver = useRef(false)
    const gameWon = useRef(false)
    const destroyedTorch = useRef(false)
    const [bonus, setBonus] = useState(0)
    const [bombs, setBombs] = useState(Math.round(totalBonuses * 0.7))
    const forceUpdate = useReducer(() => ({}))[1]

    function canMove(x, y) {
        if (x < 0 || y < 0 || x >= HEIGHT || y >= WIDTH || grid[x][y].type === "wall")
            return false
        return true
    }

    function checkExplosion(x, y) {
        if (grid[x][y].type === "bonus") {
            gameOver.current = true
            playSound("end")
            destroyedTorch.current = true
        }
    }

    function playSound(sound) {
        switch (sound) {
            case "explode":
                explodeSound.play()
                break
            case "bonus":
                bonusSound.play()
                break
            case "win":
                winSound.play()
                break
            case "end":
                endSound.play()
                break
        }
    }

    function explodeBomb() {
        let x = currentCell.x, y = currentCell.y, explosionImage = getImage("explosion"), emptyImage = getImage("empty")
        playSound("explode")

        checkExplosion(x, y)
        grid[x][y].type = "explosion"
        grid[x][y].img = explosionImage

        for (let i = 1; i <= EXPLOSION_SIZE; i++) {
            if ((x + i) < HEIGHT) {
                checkExplosion(x + i, y)
                grid[x + i][y].type = "explosion"
                grid[x + i][y].img = explosionImage
            }
            if ((x - i) >= 0) {
                checkExplosion(x - i, y)
                grid[x - i][y].type = "explosion"
                grid[x - i][y].img = explosionImage
            }
            if ((y - i) >= 0) {
                checkExplosion(x, y - i)
                grid[x][y - i].type = "explosion"
                grid[x][y - i].img = explosionImage
            }
            if ((y + i) < WIDTH) {
                checkExplosion(x, y + i)
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
            }, 250);
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
                playSound("end")
                gameOver.current = true
            }
            if (grid[newX][newY].type === "bonus") {
                playSound("bonus")

                grid[newX][newY].type = "empty"
                grid[newX][newY].img = getImage("empty")

                setBonus(bonus => bonus + 1)

                if ((bonus + 1) === totalBonuses) {
                    gameWon.current = true
                }

            }
            setCurrentCell(grid[newX][newY])
        }
    };

    function restartGame() {
        gameOver.current = false
        window.location.reload();

    }

    return (
        <Container>
            {gameOver.current &&
                <Container className="game-over-modal">
                    <h2>Game over</h2>
                    {destroyedTorch.current && <h3>You destroyed a torch!</h3>}
                    {!destroyedTorch.current && <h3>You got killed!</h3>}
                    <button className="button btn-restart" onMouseDown={() => restartGame()}>Go back</button>
                </Container>
            }
            {gameWon.current &&
                <Container className="game-won-modal">
                    <h2>💣Game won!💣</h2>
                    <button className="button btn-restart" onMouseDown={() => restartGame()}>Go back</button>
                </Container>
            }
            <Container className="grid">
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
            {!gameOver.current && !gameWon.current &&
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