import { useState } from "react";
import { Container, Row, Col } from 'react-bootstrap'
import Cell from './Cell'

const HEIGHT = 17, WIDTH = 24

function generateRandomType(i, j) {
    let random, type;
    random = Math.random()
    if (random < 0.02)
        type = "bonus"
    else if ((random > 0.1 && random < 0.8) || (i < 3 && j < 3))
        type = "empty"
    else
        type = "wall"
    return type
}

function getImage(type){
    switch(type){
        case "empty":
            return "cobblestone.png"
        case "wall":
            return "wall.png"
        case "bonus":
            return "bonus.png"
    }
}

function GenerateGrid() {
    let grid = [];
    let row;
    for (let i = 0; i < HEIGHT; i++) {
        row = []
        for (let j = 0; j < WIDTH; j++) {
            let type = generateRandomType(i,j)
            let img = getImage(type)
            let info = { "img": img, "type": type, "x": i, "y": j }
            row.push(info)
        }
        grid.push(row);
    }
    return grid;
}

function Grid() {
    const [grid, setGrid] = useState(GenerateGrid());
    const [currentCell, setCurrentCell] = useState({ "x": 0, "y": 0 });


    function canMove(x, y) {
        if (x < 0 || y < 0 || x >= HEIGHT || y >= WIDTH || grid[x][y].type === "wall")
            return false
        return true
    }

    function handleMove(direction) {
        let x = 0, y = 0;
        switch (direction) {
            case "left":
                x = currentCell.x
                y = currentCell.y - 1
                break;
            case "right":
                x = currentCell.x
                y = currentCell.y + 1
                break;
            case "up":
                x = currentCell.x - 1
                y = currentCell.y
                break;
            case "down":
                x = currentCell.x + 1
                y = currentCell.y
                break;
        }

        console.log("current", currentCell)
        console.log("next", grid[x][y])

        if (canMove(x, y)) {
            setCurrentCell({ "x": x, "y": y })
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
            </Container>
        </Container>
    );
}

export default Grid;