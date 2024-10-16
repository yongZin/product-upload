//유저 API
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export const useLogin = () => {
	return useMutation({
		mutationFn: async (userData) => {
			const response = await axios.patch("/api/users/login", userData);

			return response.data;
		}
	});
};

export const useLogout = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async () => {
			const sessionId = localStorage.getItem("sessionId");
			const response = await axios.patch("/api/users/logout", null, {
				headers: { sessionid: sessionId },
			});

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
			const response = await axios.get("/api/users/userInfo", {
				headers: { sessionid: sessionId },
			});

			return response.data
		},
		enabled: !!sessionId //sessionId가 존재할 경우 쿼리 실행
	});
};