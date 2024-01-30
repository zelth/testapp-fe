import axios, { AxiosResponse, AxiosError, AxiosRequestHeaders, AxiosRequestConfig } from 'axios';

interface AdaptAxiosRequestConfig extends AxiosRequestConfig {
	headers: AxiosRequestHeaders;
}

const axiosClient = axios.create({
	baseURL: `${import.meta.env.VITE_API_BASE_URL}/api`,
	withXSRFToken: true,
	withCredentials: true,
	headers: {
		Accept: 'application/json',
	},
});

axiosClient.interceptors.request.use((config): AdaptAxiosRequestConfig => {
	// config.headers.Authorization = `Bearer ${token}`;

	return config;
});

axiosClient.interceptors.response.use(
	(response: AxiosResponse) => {
		return response;
	},
	(error: AxiosError) => {
		// Handle error responses
		if (error.response) {
			console.error('Response error:', error.response.data);
			console.error('Status code:', error.response.status);
		} else if (error.request) {
			console.error('Request error:', error.request);
		} else {
			console.error('Error:', error.message);
		}
		return Promise.reject(error);
	}
);

export default axiosClient;
