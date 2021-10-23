const path = require("path")
require("dotenv").config({ path: path.join(__dirname, ".env") })
const express = require("express")
const app = express()
const cors = require("cors")
const middlewares = require("./middlewares")
const { v4: uuidv4 } = require("uuid")
const crypto = require("crypto")
const fs = require("fs")
const jwt = require("jsonwebtoken")

try {
    fs.mkdirSync(path.join(__dirname, process.env.FILE_FOLDER))
} catch (error) {}

const db = require("./DBinstance")

const fileUpload = require("express-fileupload")
app.use(fileUpload({ useTempFiles: true, tempFileDir: "/tmp/" }))

app.use(
    express.json({
        // limit: "50mb",
    })
)
app.use(
    express.urlencoded({
        extended: true,
    })
)

app.use(cors())

app.use(middlewares.setAuth)

app.post("/sign", (req, res, next) => {
    const { username, password } = req.body
    if (!username || !password) return res.status(400).send()

    if (db.data.users.find((u) => u.username == username))
        return res.status(400).send()

    const id = uuidv4()

    db.data.users.push({
        admin: false,
        username,
        password: crypto
            .createHmac("sha256", process.env.HASH)
            .update(password)
            .digest("hex"),
        id: id,
    })

    db.write()

    res.status(201).json({ token: jwt.sign({ id: id }, process.env.JWT) })
})

app.post("/login", (req, res, next) => {
    const { username, password } = req.body
    const user = db.data.users.find(
        (u) =>
            u.username == username &&
            u.password ===
                crypto
                    .createHmac("sha256", process.env.HASH)
                    .update(password)
                    .digest("hex")
    )
    if (!user) return res.status(400).send()
    res.status(200).json({ token: jwt.sign({ id: user.id }, process.env.JWT) })
})

app.get("/me", middlewares.isAuth, (req, res, next) => {
    const user = db.data.users.find((u) => u.id === req.auth.id)
    if (!user) return res.status(404).send()
    res.status(200).json({ ...user, password: null })
})

app.get("/puzzles", (req, res, next) => {
    res.status(200).json(db.data.puzzles)
})

app.get("/puzzles/:id", (req, res, next) => {
    const puzzle = db.data.puzzles.find((p) => p.id === req.params.id)
    if (!puzzle) return res.status(404).send()
    res.status(200).json(puzzle)
})

app.delete("/puzzles/:id", middlewares.isAdmin, (req, res, next) => {
    db.data.puzzles = db.data.puzzles.filter((p) => p.id !== req.params.id)
    db.write()
    res.status(204).send()
})

app.post("/puzzles", middlewares.isAdmin, (req, res, next) => {
    const puzzle = { ...req.body, id: uuidv4() }

    if (req.files.image) {
        const file = path.join(
            process.env.FILE_FOLDER,
            uuidv4() + req.files.image.name
        )
        req.files.image.mv(path.join(__dirname, file))
        puzzle.image = file
    }

    db.data.puzzles.push(puzzle)
    db.write()
    res.status(201).json(puzzle)
})

app.get("/asset", (req, res, next) => {
    res.sendFile(path.join(__dirname, req.query.path))
})

app.use(express.static(path.join(__dirname, process.env.STATIC_WEBSITE)))

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`SERVER ON : ${PORT}`))
