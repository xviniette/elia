import React from "react"
import axios from "../axios"
import { useHistory } from "react-router-dom"

export default ({ reload }) => {
    let history = useHistory()

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault()
                const data = {}
                for (let el of e.target.elements) {
                    if (el.name) data[el.name] = el.value
                }

                axios.post("/sign", data).then((res) => {
                    localStorage.setItem(
                        process.env.REACT_APP_TOKEN_KEY,
                        res.data.token
                    )
                    reload()
                    history.push("/")
                })
            }}
        >
            <input type="text" name="username" placeholder="Username" />
            <input type="text" name="password" placeholder="Password" />
            <button type="submit">Sign in</button>
        </form>
    )
}
