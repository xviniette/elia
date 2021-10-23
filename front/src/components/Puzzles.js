import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import axios from "../axios"

export default ({ authUser }) => {
    const [puzzles, setPuzzles] = useState([])

    useEffect(() => {
        axios.get("puzzles").then((res) => setPuzzles(res.data))
    }, [])

    const add = (file) => {
        const formData = new FormData()
        formData.append("image", file, file.name)

        axios
            .post("puzzles", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
            .then((res) => setPuzzles([...puzzles, res.data]))
    }

    const remove = (id) => {
        axios
            .delete(`puzzles/${id}`)
            .then((res) => setPuzzles(puzzles.filter((p) => p.id !== id)))
    }

    return (
        <div>
            {authUser?.admin && (
                <label class="btn btn-primary btn-lg">
                    Ajouter Puzzle
                    <input
                        type="file"
                        onChange={(e) => {
                            if (e.target.files[0]) add(e.target.files[0])
                        }}
                        hidden
                    />
                </label>
            )}

            <div class="container">
                <div class="row row-cols-3">
                    {puzzles.map((puzzle) => (
                        <div class="col">
                            <div class="card">
                                <img
                                    src={`${process.env.REACT_APP_API}asset?path=${puzzle.image}`}
                                    class="card-img-top "
                                    alt="..."
                                />
                                <div class="card-body">
                                    <Link
                                        to={`puzzle/${puzzle.id}`}
                                        class="btn btn-primary"
                                    >
                                        Jouer
                                    </Link>

                                    {authUser?.admin && (
                                        <button
                                            class="btn btn-danger"
                                            onClick={() => remove(puzzle.id)}
                                        >
                                            Supprimer
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
