import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:3600",
    headers: {"Content-type": "application/json"},
  // axios waits forever by default; a stuck request would leave the buttons disabled
  timeout: 10000,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// one place that turns any request error into a message the user can read
type ErrBody = {message?: unknown};

export function error_message(err: unknown): string {
    if (!axios.isAxiosError<ErrBody>(err)) return "Something went wrong, please try again";
    if (err.code === "ECONNABORTED") return "The server is taking too long, please try again";
    if (!err.response) return "Could not reach the server, check that it is running";
    const text = err.response.data?.message;
    return typeof text === "string" ? text : "Something went wrong, please try again";
}

export const error_status = (err: unknown) => (axios.isAxiosError(err) ? err.response?.status : undefined);
