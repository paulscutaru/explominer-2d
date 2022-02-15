import { useState, useReducer } from "react";
import { Container, Row, Col } from 'react-bootstrap'
import { getImage, playSound } from './utils/Utils'
import Cell from './Cell'

function Grid(props) {
    let grid = props.grid
    let HEIGHT = props.HEIGHT
    let WIDTH = props.WIDTH
    let EXPLOSION_SIZE = props.EXPLOSION_SIZE
    let totalBonuses = props.totalBonuses

    const [currentCell, setCurrentCell] = useState(grid[1][1])
    const [buttonBombEnabled, setButtonBombEnabled] = useState(true)
    const [poisonEffect, setPoisonEffect] = useState(false)
    const [gameOver, setGameOver] = useState(false)
    const [gameWon, setGameWon] = useState(false)
    const [gameOverCause, setGameOverCause] = useState("")
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
            setGameOver(true)
            setGameOverCause("Your bomb destroyed a torch!")
            playSound("end")
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
        if (buttonBombEnabled && (bombs > 0)) {
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

    function eraseEffects() {
        document.getElementById("grid").style.filter = "none"
        setPoisonEffect(false)
    }


    function handleMove(direction) {
        let newX = 0, newY = 0

        if (poisonEffect) {
            let allDirections = ["left", "right", "up", "down"]
            direction = allDirections[Math.floor(Math.random() * allDirections.length)]
        }

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
            setCurrentCell(grid[newX][newY])
            playSound("walk")

            if (grid[newX][newY].type === "skull") {
                setGameOverCause("You died!")
                playSound("end")
                eraseEffects()
                setGameOver(true)
            }
            else if (grid[newX][newY].type === "trap") {
                grid[newX][newY].type = "empty"
                grid[newX][newY].img = getImage("empty")

                document.getElementById("grid").style.filter = "hue-rotate(90deg)";

                setPoisonEffect(true)

                setTimeout(eraseEffects, 5000)
                playSound("poison")
            }
            else if (grid[newX][newY].type === "bonus") {

                grid[newX][newY].type = "empty"
                grid[newX][newY].img = getImage("empty")

                setBonus(bonus => bonus + 1)

                playSound("bonus")

                if ((bonus + 1) === totalBonuses) {
                    playSound("win")
                    setGameWon(true)
                }
            }
        }
    };

    function restartGame() {
        setGameOver(false)
        window.location.reload();
    }

    return (
        <Container>
            {gameOver &&
                <Container className="game-over-modal">
                    <h2>Game over</h2>
                    <h3>{gameOverCause}</h3>
                    <button className="button btn-restart" onMouseDown={() => restartGame()}>Back</button>
                </Container>
            }
            {gameWon &&
                <Container className="game-won-modal">
                    <h2>💣Game won!💣</h2>
                    <button className="button btn-restart" onMouseDown={() => restartGame()}>Back</button>
                </Container>
            }
            <Container className="grid" id="grid">
                <Container className="score-container">
                    <h4>Torches: {bonus} / {totalBonuses}</h4>
                    <h4>💣{bombs}</h4>
                </Container>
                {grid.map((row, index) => (
                    <Row className="row-grid" key={index}>
                        {row.map((cell, i) =>
                            <Cell key={i} cell={cell} currentCell={currentCell} />
                        )}
                    </Row>
                ))}
            </Container>
            {!gameOver && !gameWon &&
                <Container className="controls" >
                    <Row>
                        <Col>
                            <button style={{ visibility: buttonBombEnabled ? 'visible' : 'hidden' }} className="button btn-bomb"
                                onMouseDown={() => putBomb()}>
                                💣
                            </button>
                        </Col>
                        <Col>
                            <button className="button" onMouseDown={() => handleMove("up")}>↑</button>
                        </Col>
                    </Row>
                    <Row>
                        <Col >
                            <button className="button" onMouseDown={() => handleMove("left")}>←</button>
                            <button className="button" onMouseDown={() => handleMove("down")}>↓</button>
                            <button className="button" onMouseDown={() => handleMove("right")}>→</button>
                        </Col>

                    </Row>
                </Container>
            }
        </Container>
    );
}

export default Grid;