import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import axios from "../axios"
import Play from "./Play"

export default (props) => {
    let { id } = useParams()
    const [puzzle, setPuzzle] = useState(null)
    const [difficulty, setDifficulty] = useState({ size: 3, loop: 5 })

    const difficulties = [
        { name: "Facile", data: { size: 3, loop: 20 } },
        { name: "Moyen", data: { size: 5, loop: 50 } },
        { name: "Hardcore", data: { size: 8, loop: 200 } },
    ]

    useEffect(() => {
        axios.get(`puzzles/${id}`).then((res) => setPuzzle(res.data))
    }, [id])

    return (
        <div>
            {puzzle && (
                <div>
                    {difficulties.map((diff) => (
                        <button
                            class="btn btn-primary"
                            onClick={() => setDifficulty(diff.data)}
                        >
                            {diff.name}
                        </button>
                    ))}
                    <Play
                        image={`${process.env.REACT_APP_API}asset?path=${puzzle.image}`}
                        {...difficulty}
                    />
                </div>
            )}
        </div>
    )
}
