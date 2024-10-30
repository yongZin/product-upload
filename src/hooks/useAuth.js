//유저 API
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient from "../clientAPI/apiClient";
import { useProductDelete } from "./useProduct"
const GUEST_ID = process.env.REACT_APP_GUEST_ID; //게스트 확인용

export const useRegister = () => {
	return useMutation({
		mutationFn: async ({ name, username, password }) => {
			if(username.length < 3)
				throw new Error("아이디를 3글자 이상으로 해주세요.");

			if(password.length < 6)
				throw new Error("비밀번호를 6글자 이상으로 해주세요.");

			const response = await apiClient.post("/users/register", {
				name,
				username,
				password
			});

			return response.data;
		}
	})
};

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
			const sessionId = localStorage.getItem("sessionId");
			const response = await apiClient.patch("/users/logout", null, {
				headers: { sessionid: sessionId }
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
			const response = await apiClient.get("/users/userInfo", {
				headers: { sessionid: sessionId },
			});

			return response.data
		},
		enabled: !!sessionId //sessionId가 존재할 경우 쿼리 실행
	});
};

export const useGuestProducts = (userInfo) => { //게스트 상품목록 가져오기
  return useQuery({
    queryKey: ["guestProducts", userInfo?.userID],
    queryFn: async () => {
      const response = await apiClient.get('/users/userInfo/products');
      return response.data;
    },
    enabled: !!userInfo && userInfo.userID === GUEST_ID,
    retry: 1,
    staleTime: 30000,
    initialDelay: 100,
  });
};

export const useDeleteGuestProducts = () => {
	const queryClient = useQueryClient();
	const deleteProduct = useProductDelete();

	const deleteAllGuestProducts = async (guestProducts) => {
		try {
			await Promise.all(
				guestProducts.map(product => deleteProduct.mutateAsync(product._id))
			)
		} catch (error) {
			throw new Error("게스트가 업로드한 상품을 삭제하는 과정에 오류가 발생했습니다.")
		}
	};

	return useMutation({
		mutationFn: deleteAllGuestProducts,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['guestProducts'] });
      queryClient.invalidateQueries({ queryKey: ['productList'] });
      queryClient.invalidateQueries({ queryKey: ['productsAll'] });
		}
	});
};