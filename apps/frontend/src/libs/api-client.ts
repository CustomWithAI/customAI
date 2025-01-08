import { env } from "@/env.mjs";
import axios from "axios";

axios.defaults.withCredentials = true;

const axiosClient = axios.create({
	baseURL: env.NEXT_PUBLIC_BACKEND_URL,
	withCredentials: true,
	headers: {
		"Content-Type": "application/json",
	},
});

axiosClient.defaults.withCredentials = true;

const axiosMediaClient = axios.create({
	baseURL: env.NEXT_PUBLIC_BACKEND_URL,
	withCredentials: true,
	headers: {
		"Content-Type": "multipart/form-data",
	},
});

export { axiosClient, axiosMediaClient };
