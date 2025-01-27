import { axiosClient } from "@/libs/api-client";

class AuthService {
	revokeOtherSession = async () => {
		try {
			const response = await axiosClient.post<{ status: boolean }>(
				"/api/auth/revoke-other-sessions",
			);
			return response.data;
		} catch (error) {}
	};
}

const authService = new AuthService();
export default authService;
