import React, { useEffect, useState } from "react"

export default ({ image, size, loop }) => {
    let [grid, setGrid] = useState([[]])
    let [moves, setMoves] = useState(0)
    let [canvas, setCanvas] = useState(null)
    let [ctx, setCTX] = useState(null)
    let [img, setImg] = useState(null)

    const imgTileSize = img ? Math.min(img.width, img.height) / size : 0
    const tileSize = canvas ? canvas.width / size : 0

    useEffect(() => {
        if (size <= 0 || loop <= 0) return
        generateGrid(size, loop)
    }, [size, loop])

    useEffect(() => {
        const canvas = document.querySelector("canvas")
        const ctx = canvas.getContext("2d")
        setCanvas(canvas)
        setCTX(ctx)

        const img = new Image()
        img.onload = () => {
            setImg(img)
        }
        img.src = image
    }, [image])

    useEffect(() => {
        if (!ctx) return
        if (!img) return
        if (!grid) return

        ctx.fillRect(0, 0, canvas.width, canvas.height)

        for (let x = 0; x < grid.length; x++) {
            for (let y = 0; y < grid[x].length; y++) {
                const value = grid[x][y]
                if (value === null) continue
                const coordY = value % grid.length
                const coordX = Math.floor(value / grid.length)

                ctx.drawImage(
                    img,
                    coordX * imgTileSize,
                    coordY * imgTileSize,
                    imgTileSize,
                    imgTileSize,
                    x * tileSize,
                    y * tileSize,
                    tileSize,
                    tileSize
                )

                ctx.strokeRect(x * tileSize, y * tileSize, tileSize, tileSize)
            }
        }
    }, [grid, ctx, img])

    const generateGrid = (size = 3, loop = 5) => {
        if (size <= 0) return
        if (loop < 0) return

        let grid = []

        //DEFAULT GRID
        let value = 0
        for (let i = 0; i < size; i++) {
            let arr = []
            for (let j = 0; j < size; j++) {
                if (i === size - 1 && j === size - 1) value = null
                arr.push(value)
                value++
            }
            grid.push(arr)
        }

        //RANDOMIZE
        let p = { x: size - 1, y: size - 1 }
        for (let i = 0; i < loop; i++) {
            const neighbors = [
                { x: p.x - 1, y: p.y },
                { x: p.x + 1, y: p.y },
                { x: p.x, y: p.y - 1 },
                { x: p.x, y: p.y + 1 },
            ].filter((p) => p.x >= 0 && p.x < size && p.y >= 0 && p.y < size)

            const neighbor =
                neighbors[Math.floor(Math.random() * neighbors.length)]

            grid[p.x][p.y] = grid[neighbor.x][neighbor.y]
            grid[neighbor.x][neighbor.y] = null
            p = neighbor
        }

        setMoves(0)
        setGrid(grid)
    }

    const isGood = () => {
        let previous = -1
        for (let x = 0; x < grid.length; x++) {
            for (let y = 0; y < grid[x].length; y++) {
                if (x === grid.length - 1 && y === grid[x].length - 1)
                    return grid[x][y] === null
                if (grid[x][y] !== previous + 1) return false
                previous = grid[x][y]
            }
        }

        return true
    }

    const movePiece = (x, y) => {
        const neighbor = [
            { x: x - 1, y: y },
            { x: x + 1, y: y },
            { x: x, y: y - 1 },
            { x: x, y: y + 1 },
        ].find(
            (p) =>
                grid[p.x] !== undefined &&
                grid[p.x][p.y] !== undefined &&
                grid[p.x][p.y] == null
        )

        if (!neighbor) return

        grid[neighbor.x][neighbor.y] = grid[x][y]
        grid[x][y] = null

        setMoves(moves + 1)

        setGrid([...grid])
    }

    return (
        <div>
            <canvas
                width="500"
                height="500"
                onClick={(e) => {
                    if (isGood()) return
                    movePiece(
                        Math.floor((e.clientX - canvas.offsetLeft) / tileSize),
                        Math.floor((e.clientY - canvas.offsetTop) / tileSize)
                    )
                }}
            ></canvas>

            {isGood() ? (
                <h1>
                    Gagné en {moves} coup{moves > 1 && "s"}!
                </h1>
            ) : (
                <h1>
                    {moves} coup{moves > 1 && "s"}
                </h1>
            )}
        </div>
    )
}
