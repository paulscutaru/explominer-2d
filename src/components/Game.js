import { useState } from 'react';
import { Container } from 'react-bootstrap'
import Grid from './Grid'

let soundtrack = new Audio(process.env.PUBLIC_URL + "/sounds/soundtrack.mp3")

function Game(props) {
    const [gameStarted, setGameStarted] = useState(false)
    const grid = props.grid

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
                    <img src={process.env.PUBLIC_URL + "/images/skull.png"} alt='' />
                    <img src={process.env.PUBLIC_URL + "/images/player.png"} alt='' />
                    <img src={process.env.PUBLIC_URL + "/images/skull.png"} alt='' />
                    <Container className="text-container">
                        <h1>Explominer 2D</h1>
                        <h3>How to play</h3>
                        <h4>• Collect all torches.<br />
                            • Use bombs wisely.<br />
                            • Avoid skulls or poison.
                        </h4>
                    </Container>
                    <button className="button btn-restart" onMouseDown={() => startGame()}>Start</button>
                </Container>
            }
            {gameStarted &&
                <Grid grid={props.grid} HEIGHT={props.HEIGHT} WIDTH={props.WIDTH}
                    EXPLOSION_SIZE={props.EXPLOSION_SIZE} totalBonuses={props.totalBonuses} />}
        </Container>
    );
}

export default Game;
