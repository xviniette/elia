import axios from "axios"

const instance = axios.create({
    baseURL: process.env.REACT_APP_API,
})

instance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(process.env.REACT_APP_TOKEN_KEY)
        if (token) config.headers["Authorization"] = token
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

instance.interceptors.response.use(
    (response) => {
        return response
    },
    (error) => {
        if (error.response.status === 401) {
            localStorage.removeItem(process.env.REACT_APP_TOKEN_KEY)
        }
        return Promise.reject(error)
    }
)

export default instance
