const jwt = require("jsonwebtoken")
const db = require("./DBinstance")

module.exports = {
    setAuth(req, res, next) {
        if (req.headers["authorization"]) {
            jwt.verify(
                req.headers["authorization"],
                process.env.JWT,
                (err, decoded) => {
                    if (err) return res.status(401).send()
                    req.auth = decoded
                    next()
                }
            )
        } else {
            next()
        }
    },
    isAuth(req, res, next) {
        if (!req.auth) return res.status(401).send()
        next()
    },
    isAdmin(req, res, next) {
        if (!req.auth) return res.status(401).send()

        const user = db.data.users.find((u) => u.id === req.auth.id)

        if (!user || !user.admin) return res.status(403).send()

        next()
    },
}
