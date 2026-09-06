import axios from "axios";

const api = axios.create({
    // In development this falls back to the local server. In production,
    // VITE_API_URL is supplied by the hosting provider (for example Render).
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

export default api;
