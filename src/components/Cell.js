import classNames from "classnames";
import { Container } from 'react-bootstrap'

function Cell(props) {
  let src;
  if (props.info.x === props.currentCell.x && props.info.y === props.currentCell.y) {
    if (props.currentCell.type === "bomb")
      src = process.env.PUBLIC_URL + "/images/player_bomb.png"
    else
      src = process.env.PUBLIC_URL + "/images/player.png"
  }
  else
    src = process.env.PUBLIC_URL + `/images/${props.info.img}`
  return (
    <button className="cell" >


      <img src={src} />
    </button>
  );
}

export default Cell;