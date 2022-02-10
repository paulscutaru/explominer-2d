import classNames from "classnames";
import { Container } from 'react-bootstrap'

function Cell(props) {
  /*className={classNames("cell", {
      "cell-current": props.info.x === props.currentCell.x && props.info.y === props.currentCell.y
    }, { "cell-wall": props.info.type === "wall" }) */
  let src;
  if (props.info.x === props.currentCell.x && props.info.y === props.currentCell.y)
    src = process.env.PUBLIC_URL + "/images/player.png"
  else
    src = process.env.PUBLIC_URL + `/images/${props.info.img}`
  return (
    <button className="cell" >


      <img src={src} />
    </button>
  );
}

export default Cell;