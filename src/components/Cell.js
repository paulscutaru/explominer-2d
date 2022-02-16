function Cell(props) {
  let src;
  if (props.cell.x === props.currentCell.x && props.cell.y === props.currentCell.y) {
    if (props.currentCell.type === "bomb")
      src = process.env.PUBLIC_URL + "/images/player_bomb.png"
    else
      src = process.env.PUBLIC_URL + "/images/player.png"
  }
  else
    src = process.env.PUBLIC_URL + `/images/${props.cell.img}`
  return (
    <button className="cell" >


      <img src={src} alt=''/>
    </button>
  );
}

export default Cell;