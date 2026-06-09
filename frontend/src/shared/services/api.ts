import axios from "axios";
import { useNavigate } from "react-router";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

export const api = axios.create({
	baseURL: `${API_URL}/api`,
	timeout: 10000,
	headers: {
		"Content-Type": "application/json",
	},
});

// Interceptor to add token to headers
api.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem("token");
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => Promise.reject(error),
);

// Interceptor to handle responses (token expiration)
api.interceptors.response.use(
	(response) => response,
	(error) => {
		if (error.response?.status === 401) {
			localStorage.removeItem("token");
			const navigate = useNavigate();
			navigate("/login", { replace: true });
		}
		return Promise.reject(error);
	},
);
