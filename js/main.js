// Used in the "bxcad.html" page

import { Brcad } from "./bread.js";
import { loadImage, loadJSON } from "./loaders.js";
import { downloadMultipleFiles } from "./multidownload.js";

// Wait for the document to load
await new Promise((resolve, reject) => {document.addEventListener("DOMContentLoaded", resolve)})

console.log("woohoo welcome to the sprite preview page")

const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")

const inputImagePath = document.getElementById("imgPath")
const inputJSONPath = document.getElementById("jsonPath")
const spriteSlider = document.getElementById("spriteSlider")
const spriteNum = document.getElementById("spriteNum")

const inputOffsetX = document.getElementById("offsetX")
const inputOffsetY = document.getElementById("offsetY")

const reloadButton = document.getElementById("loadButton")

let currentBxcad = null
let middleDown = false

let xOffset = -200
let yOffset = -210

async function reload() {

    const imgPath = inputImagePath.value
    const jsonPath = inputJSONPath.value

    const img = await loadImage(imgPath)
    const json = await loadJSON(jsonPath)

    currentBxcad = new Brcad(json, img)

    xOffset = -200
    yOffset = -210
    inputOffsetX.value = xOffset
    inputOffsetY.value = yOffset

    spriteSlider.min = 0
    spriteSlider.max = json.data.sprites.length - 1
    spriteSlider.value = 0

    spriteNum.min = 0
    spriteNum.max = spriteSlider.max
    spriteNum.value = 0

    console.log(spriteSlider.max, "sprites to go")

}

reloadButton.addEventListener("mousedown", e => {

    try{
        reload()
    } catch(e) {
        alert(`Error loading: ${e}`)
    }
})

spriteNum.addEventListener("change", e => {
    spriteSlider.value = spriteNum.value
})

spriteSlider.addEventListener("change", e => {
    spriteNum.value = spriteSlider.value
})

// Middle mouse button to offset
canvas.addEventListener("mousedown", e => {
    if (e.button == 1) {
        middleDown = true
    }
})

document.addEventListener("mouseup", e => {
    if (e.button == 1) {
        middleDown = false
    }
})

document.addEventListener("mousemove", e => {

    if (!middleDown) return

    var x_scale = canvas.width / canvas.clientWidth
    var y_scale = canvas.height / canvas.clientHeight
    
    var x = e.movementX// - canvas.offsetLeft;
    x *= x_scale
    var y = e.movementY// - canvas.offsetTop;
    y *= y_scale

    xOffset += x
    yOffset += y

    inputOffsetX.value = xOffset
    inputOffsetY.value = yOffset

})

async function getSpriteLinks() {
    const links = []

    for (let i = 0; i < spriteSlider.max; i++) {
        spriteSlider.value = i
        draw()

        canvas.toBlob((blob) => {
            const url = URL.createObjectURL(blob);
            links.push(url)
            console.log(url)
        }, "image/png")
    }  

    spriteSlider.value = 0
    return links
}

inputOffsetX.addEventListener("change", () => {
    xOffset = inputOffsetX.value
})

inputOffsetY.addEventListener("change", () => {
    yOffset = inputOffsetY.value
})

document.getElementById("downloadall").addEventListener("mousedown", e => {
    var links = getSpriteLinks()

    setTimeout(() => {
        downloadMultipleFiles(links)
    }, 1000);
})

function draw() {
    
    ctx.resetTransform()
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    if (currentBxcad == null) {
        return
    }

    ctx.transform(1, 0, 0, 1, xOffset, yOffset)

    try {
        currentBxcad.drawSprite(spriteSlider.value, ctx, ctx.getTransform())
    } catch {
        console.log("ERROR")
        ctx.font = "10px serif"
        ctx.fillText("ERROR", 60, 60)
    }
}

function update() {

    draw()
    requestAnimationFrame(update)

}

await reload()

update()