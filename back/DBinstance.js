const path = require("path")
const DB = require("./db")

module.exports = new DB(path.join(__dirname, process.env.DB), {
    puzzles: [],
    users: [],
})
