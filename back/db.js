const fs = require("fs")
const path = require("path")

module.exports = class {
    constructor(db = "db.json", seed = {}) {
        this.path = db
        this.data = seed

        this.read()
    }

    read() {
        try {
            const data = fs.readFileSync(this.path, { encoding: "utf-8" })
            this.data = JSON.parse(data)
        } catch (error) {
            console.error(error)
        }
    }

    write() {
        try {
            fs.writeFileSync(this.path, JSON.stringify(this.data), {
                encoding: "utf-8",
            })
        } catch (error) {
            console.error(error)
        }
    }
}
