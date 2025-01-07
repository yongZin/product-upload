//상품 관련 컴포넌트
import React, { createContext, useState, useEffect, useCallback } from "react";
import { useProductList, useProductsAll } from "../hooks/useProduct";

export const ProductContext = createContext();

export const ProductProvider = (prop) => {
	const [productsList, setProductsList] = useState([]); //상품 리스트용
	const [previews, setPreviews] = useState([]);
	const [selectedProduct, setSelectedProduct] = useState();
	const [confirm, setConfirm] = useState(false);
	const [uploadLoad, setUploadLoad] = useState(false);
	const [loadingFinish, setLoadingFinish] = useState(false);
	const [productForm, setProductForm] = useState({
    name: "",
    price: "",
    mainImages: [],
    details: [],
    detailImages: [],
    type: "",
    material: "",
    color: "",
  });
	const [filters, setFilters] = useState({
		sort: "new",
		color: "",
		type: ""
	});

	const { products, totalProductCount, isLoading } = useProductList(filters); //상품 리스트 API 훅
	const { productsAll } = useProductsAll(); //필터용 모든 상품 정보 API 훅

	useEffect(() => { //렌더링시 첫 상품 로드
    const initialProducts = products.slice(0, 6);
		
    if (products) {
			setProductsList(initialProducts);
		}
	}, [products]);

	useEffect(() => { //첫 상품 로드 전 로딩 애니메이션
		if(productsList.length === 0) {
			setUploadLoad(true);
		} else{
			setUploadLoad(false);
		}
	}, [productsList]);

	const loadMoreProduct = useCallback(() => { //무한 스크롤(6개씩 불러오기)
		if (uploadLoad) return;
		
		const startIndex = productsList.length;
		const endIndex = startIndex + 6;
		const newProducts = products.slice(startIndex, endIndex);
		
		setProductsList((prevProducts) => [...prevProducts, ...newProducts]);
	}, [uploadLoad, products, productsList]);

	const updateProductForm = (field, value) => {
    setProductForm((prev) => {
      if (typeof value === 'function') { // value가 함수인 경우 이전 상태를 기반으로 업데이트
        return {
          ...prev,
          [field]: value(prev[field])
        };
      }
      
      return { // 일반적인 값인 경우 직접 업데이트
        ...prev,
        [field]: value
      };
    });
  };

	const updateFilter = (filterType, value) => {
		setFilters((prev) => ({
			...prev,
			[filterType]: value
		}));
	};

	const productDetails = (itemID) => { //선택 상품의 정보를 상세화면으로 전달
		const selectedItem = products.find((item) => item._id === itemID);

		setSelectedProduct(selectedItem);
	};

	const toggleClick = (e) => {
		if (!e.target.className) e.target.className = "on"
		else e.target.className = ""
	};

	const resetProductForm = () => {
		setPreviews([]);
		setProductForm({
      name: "",
      price: "",
      mainImages: [],
      previews: [],
      details: [],
      detailImages: [],
      type: "",
      material: "",
      color: "",
    });
	};

	const resetFilters = () => {
    setFilters({
      sort: "new",
      color: "",
      type: ""
    });
  };

	const productContextValue = {
		products,
		productsList,
		productsAll,
		previews, setPreviews,
		productForm, setProductForm,
		selectedProduct, setSelectedProduct,
		confirm, setConfirm,
		uploadLoad, setUploadLoad,
		filters, setFilters,
		totalProductCount,
		loadingFinish, setLoadingFinish,
		updateProductForm,
		resetProductForm,
		updateFilter,
		resetFilters,
		loadMoreProduct,
		toggleClick,
		productDetails,
		isLoading: isLoading
	};
	
	return (
		<ProductContext.Provider value={productContextValue}>
			{prop.children}
		</ProductContext.Provider>
	)
}