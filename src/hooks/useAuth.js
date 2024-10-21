//유저 API
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient from "../clientAPI/apiClient";

export const useLogin = () => {
	return useMutation({
		mutationFn: async (userData) => {
			const response = await apiClient.patch("/users/login", userData);

			return response.data;
		}
	});
};

export const useLogout = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async () => {
			const response = await apiClient.patch("/users/logout", null);

			return response.data;
		},
		onSuccess: () => {
			localStorage.removeItem("sessionId");
			queryClient.removeQueries("userInfo");
		},
    onError: (error) => {
      console.error("Logout error:", error.response?.data || error.message);
    }
	});
};

export const useUserInfo = (sessionId) => {
	return useQuery({
		queryKey: ["userInfo", sessionId],
		queryFn: async () => {
			const response = await apiClient.get("/users/userInfo", {
				headers: { sessionid: sessionId },
			});

			return response.data
		},
		enabled: !!sessionId //sessionId가 존재할 경우 쿼리 실행
	});
};