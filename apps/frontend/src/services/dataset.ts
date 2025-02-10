import { axiosClient } from "@/libs/api-client";

class DatasetService {
	async createDataset() {
		try {
			axiosClient.post("/dataset");
		} catch (error) {}
	}

	async updateDataset() {
		try {
			axiosClient.patch("/dataset");
		} catch (error) {}
	}

	async deleteDataset() {
		try {
			axiosClient.delete("/dataset");
		} catch (error) {}
	}
}
