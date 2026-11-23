import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:3600",
    headers: {"Content-type": "application/json"},
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// one place that turns any request error into a message the user can read
export function error_message(err: unknown) {
    if (!axios.isAxiosError(err)) return "Something went wrong, please try again";
    if (!err.response) return "Could not reach the server, check that it is running";
    return err.response.data?.message ?? "Something went wrong, please try again";
}

export const error_status = (err: unknown) => (axios.isAxiosError(err) ? err.response?.status : undefined);
