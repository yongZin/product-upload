//상품 관련 컴포넌트
import React, { createContext, useState, useEffect, useCallback } from "react";
import apiClient from "../clientAPI/apiClient";

export const ProductContext = createContext();
export const ProductInfoContext = createContext();
export const ProductQuillContext = createContext();

export const ProductProvider = (prop) => {
	const [products, setProducts] = useState([]); //전체상품
	const [productsList, setProductsList] = useState([]); //상품 리스트용
	const [productsAll, setProductsAll] = useState([]); //상품 필터용
	const [previews, setPreviews] = useState([]);
	const [selectedProduct, setSelectedProduct] = useState();
	const [confirm, setConfirm] = useState(false);
	const [uploadLoad, setUploadLoad] = useState(false);
	const [uploadError, setUploadError] = useState(false);
	const [totalProductCount, setTotalProductCount] = useState("");
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

	const loadMoreProduct = useCallback(() => {
		if (uploadLoad) return;
		setUploadLoad(true);
		
		const startIndex = productsList.length;
		const endIndex = startIndex + 6;
		const newProducts = products.slice(startIndex, endIndex);
		
		setProductsList((prevProducts) => [...prevProducts, ...newProducts]);
		setUploadLoad(false);
	}, [uploadLoad, products, productsList]);

	const updateProductForm = (field, value) => {
		setProductForm((prev) => ({
			...prev,
			[field]: value
		}));
	};

	const updateFilter = (filterType, value) => {
		setFilters((prev) => ({
			...prev,
			[filterType]: value
		}));
	};

	useEffect(() => {
		setProducts([]);
		setTotalProductCount(0);

		setUploadLoad(true);

		apiClient
			.get("/upload", {
				params: {
					sort: filters.sort,
					color: filters.color,
					type: filters.type,
				}
			})
			.then((result) => {
				if (result.data.products.length > 0) {
					setProducts(result.data.products);
					setTotalProductCount(result.data.productCount);
					setLoadingFinish(true);
				}
			})
			.catch((error) => {
				console.error(error);
				setUploadError(error);
			})
			.finally(() => {
				setUploadLoad(false);
			});
	}, [filters]);

	useEffect(() => { //렌더링시 첫 상품 로드
    const initialProducts = products.slice(0, 6);
		
    if (products) {
			setProductsList(initialProducts);
		}
	}, [products]);

	useEffect(() => {//productsAll에 상품정보 담기(모든 상품 저장)
		setUploadLoad(true);

		apiClient
			.get("/upload/all")
			.then((result) => setProductsAll((prevData) => [...prevData, ...result.data]))
			.catch((error) => {
				console.error(error);
				setUploadError(error);
			})
			.finally(() => {
				setUploadLoad(false);
			});
	}, []);

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
		products, setProducts,
		productsList, setProductsList,
		productsAll, setProductsAll,
		previews, setPreviews,
		productForm, setProductForm,
		selectedProduct, setSelectedProduct,
		confirm, setConfirm,
		uploadLoad, setUploadLoad,
		uploadError,
		filters, setFilters,
		totalProductCount, setTotalProductCount,
		loadingFinish, setLoadingFinish,
		updateProductForm,
		resetProductForm,
		updateFilter,
		resetFilters,
		loadMoreProduct,
		toggleClick,
		productDetails,
	};
	
	return (
		<ProductContext.Provider value={productContextValue}>
			{prop.children}
		</ProductContext.Provider>
	)
}