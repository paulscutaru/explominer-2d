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
        case "skull":
            return "skull.png"
    }
}

function playSound(sound) {
    let explodeSound = new Audio(process.env.PUBLIC_URL + "/sounds/explode.mp3")
    let bonusSound = new Audio(process.env.PUBLIC_URL + "/sounds/bonus.mp3")
    let endSound = new Audio(process.env.PUBLIC_URL + "/sounds/end.mp3")
    let winSound = new Audio(process.env.PUBLIC_URL + "/sounds/win.mp3")
    let walk1Sound = new Audio(process.env.PUBLIC_URL + "/sounds/walk1.mp3")
    let walk2Sound = new Audio(process.env.PUBLIC_URL + "/sounds/walk2.mp3")

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
        case "walk":
            if (Math.random() < 0.5)
                walk1Sound.play()
            else
                walk2Sound.play()
            break
    }
}

export { getImage, playSound }