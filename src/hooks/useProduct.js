import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import apiClient from "../clientAPI/apiClient";

export const useUpload = () => { //상품 업로드
  const queryClient = useQueryClient();

  const createPresigned = useMutation({ //이미지 presign URL 생성
    mutationFn: async ({ images, type }) => {
      if (!images || images.length === 0) {
        return { presignedData: [], type };
      }

      const contentTypes = type === "main" 
      ? images.map(image => image.type)
      : images.map(image => image.file.type);

      const response = await apiClient.post("/upload/presigned", {
        contentTypes
      });

      return { presignedData: response.data, type };
    }
  });

  const uploadS3 = useMutation({ //S3에 이미지 업로드
    mutationFn: async ({ presignedData, images }) => {
      if (!presignedData || !images || images.length === 0) {
        return [];
      }

      return Promise.all(
        images.map( async (file, index) => {
          const { presigned } = presignedData[index];
          const formData = new FormData();

          for (const key in presigned.fields) {
            formData.append(key, presigned.fields[key]);
          }

          const actualFile = file.file || file;
          formData.append("Content-Type", actualFile.type);
          formData.append("file", actualFile);

          return apiClient.post(presigned.url, formData);
        })
      );
    }
  });
  
  const createProduct = useMutation({
    mutationFn: async ({ productData, mainPresignedData, detailPresignedData }) => {
      
      const response = await apiClient.post("/upload", {
        ...productData,
        mainImages: mainPresignedData.map((data) => ({
          imageKey: data.imageKey,
        })),
        detailImages: detailPresignedData?.map((data) => ({
          imageKey: data.imageKey,
        })) || []
      });

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["productList"] });
      queryClient.invalidateQueries({ queryKey: ["productsAll"] });
    }
  });

  return {
    createPresigned,
    uploadS3,
    createProduct
  }
};

export const useProductDelete = () => { //상품 삭제
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productId) => {
      const response = await apiClient.delete(`/upload/${productId}`);

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["productList"] });
      queryClient.invalidateQueries({ queryKey: ["productsAll"] });
      queryClient.invalidateQueries({ queryKey: ["productDetails"] });
    }
  });
};

export const useLike = () => { //상품 좋아요
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ productId, hasLiked }) => {
      const response = await apiClient.patch(`/upload/${productId}/${hasLiked ? "unlike" : "like"}`);

      return response.data;
    },
    onSuccess: (data, variables) => {
      queryClient.setQueryData(["productDetails", variables.productId], (oldData) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          likes: data.likes
        };
      });

      queryClient.invalidateQueries({ queryKey: ["productList"] });
      queryClient.invalidateQueries({ queryKey: ["productsAll"] });
    }
  });
};

export const useRecommended = (productId, productType) => {
  return useQuery({
    queryKey: ["recommendedProducts", productId],
    queryFn: async () => {
      if (!productId || !productType) return [];

      const response = await apiClient.get("/upload/recommend", {
        params: {
          id: productId,
          type: productType,
        }
      });

      return response.data;
    },
    enabled: !!productId && !!productType, //productId와 type이 있을 때만 쿼리 실행
    staleTime: 5 * 60 * 1000, // 5분 동안 캐시 유지
    cacheTime: 30 * 60 * 1000 // 30분 동안 캐시 보관
  });
}

export const useProductsAll = () => { //모든 상품 정보 저장
	const { data } = useQuery({
		queryKey: ["productsAll"],
		queryFn: async () => {
			const response = await apiClient.get("/upload/all");

			return {
        productsAll: response.data
      }
		},
    initialData: { productsAll: [] }  // 초기값
	});

  return {
    productsAll: data?.productsAll || [],
  }
};

export const useProductList = (filters) => { //현재 보이는 상품 리스트
  const { data } =  useQuery({
    queryKey: ["productList", filters],
    queryFn: async () => {
      const response = await apiClient.get("/upload", {
        params: {
          sort: filters.sort,
          color: filters.color,
          type: filters.type,
        }
      });

      return {
        products: response.data.products,
        productCount: response.data.productCount
      };
    },
    initialData: {
      products: [],
      productCount: 0
    }
  });

  return {
    products: data?.products || [],
    totalProductCount: data?.productCount || [],
  }
};