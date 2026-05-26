import axios from "axios";
const API_URL = import.meta.env.API_URL || "http://localhost:8080";

export const api = axios.create({
	baseURL: `${API_URL}/api`,
	timeout: 10000,
	headers: {
		"Content-Type": "application/json",
	},
});
