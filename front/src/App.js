import { HashRouter as Router, Route, Switch, Link } from "react-router-dom"

import Puzzles from "./components/Puzzles"
import Puzzle from "./components/Puzzle"
import Sign from "./components/Sign"
import Login from "./components/Login"

import axios from "./axios"

import React, { useEffect, useState } from "react"

const App = () => {
    const [authUser, setAuthUser] = useState(null)

    const getMe = () => {
        axios
            .get("me")
            .then((res) => setAuthUser(res.data))
            .catch((err) => setAuthUser(null))
    }

    useEffect(() => {
        getMe()
    }, [])

    return (
        <Router>
            <nav class="navbar navbar-light bg-light">
                <div class="container-fluid">
                    <Link to="/" class="navbar-brand">
                        PUZZLE
                    </Link>
                    {!authUser && (
                        <div class="d-flex">
                            <Link to="/login" class="btn">
                                Login
                            </Link>
                            <Link to="/sign" class="btn">
                                Sign in
                            </Link>
                        </div>
                    )}
                    {authUser && (
                        <div class="d-flex">
                            <button
                                class="btn"
                                onClick={() => {
                                    localStorage.removeItem(
                                        process.env.REACT_APP_TOKEN_KEY
                                    )
                                    setAuthUser(null)
                                }}
                            >
                                {authUser.username} - Déconnexion
                            </button>
                        </div>
                    )}
                </div>
            </nav>
            <Switch>
                <Route path="/puzzle/:id">
                    <Puzzle />
                </Route>
                <Route path="/sign">
                    <Sign reload={getMe} />
                </Route>
                <Route path="/login">
                    <Login reload={getMe} />
                </Route>
                <Route path="/">
                    <Puzzles authUser={authUser} />
                </Route>
            </Switch>
        </Router>
    )
}

export default App
