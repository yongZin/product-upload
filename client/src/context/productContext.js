//상품 관련 컴포넌트
import React, { createContext, useState, useEffect, useCallback } from "react";
import axios from "axios";

export const ProductContext = createContext();
export const ProductInfoContext = createContext();
export const ProductQuillContext = createContext();

export const ProductProvider = (prop) => {
	const [products, setProducts] = useState([]); //상품 리스트용
	const [productsAll, setProductsAll] = useState([]); //상품 필터용
	const [name, setName] = useState("");
	const [price, setPrice] = useState("");
	const [mainImages, setMainImages] = useState([]);
	const [previews, setPreviews] = useState([]);
	const [details, setDetails] = useState([]);
	const [detailImages, setDetailImages] = useState([]);
	const [type, setType] = useState("");
	const [material, setMaterial] = useState("");
	const [color, setColor] = useState("");
	const [selectedProduct, setSelectedProduct] = useState();
	const [uploadLoad, setUploadLoad] = useState(false);
	const [uploadError, setUploadError] = useState(false);
	const [srotFilterValue, setSrotFilterValue] = useState("new");
	const [colorFilterValue, setColorFilterValue] = useState("");
	const [typeFilterValue, setTypeFilterValue] = useState("");
	const [totalProductCount, setTotalProductCount] = useState("");
	const [lastProductId, setLastProductId] = useState("");

	const loadMoreProduct = useCallback(() => {
		if (uploadLoad || !lastProductId) return;

		setUploadLoad(true);

		axios
			.get(`/upload`, {
				params: {
					lastid: lastProductId,
					sort: srotFilterValue,
					color: colorFilterValue,
					type: typeFilterValue,
				}
			})
			.then((result) => {
				if (result.data.products.length > 0) {
					setProducts((prevData) => [...prevData, ...result.data.products]);
					setLastProductId(result.data.products[result.data.products.length - 1]._id);
					setTotalProductCount(result.data.productCount);
				}
			})
			.catch((error) => {
				console.error(error);
				setUploadError(error);
			})
			.finally(() => {
				setUploadLoad(false);
			});
	}, [uploadLoad, lastProductId, srotFilterValue, colorFilterValue, typeFilterValue]);

	useEffect(() => {
		setProducts([]);
		setLastProductId(null);
		setTotalProductCount(0);

		setUploadLoad(true);

		axios
			.get(`/upload`, {
				params: {
					sort: srotFilterValue,
					color: colorFilterValue,
					type: typeFilterValue,
				}
			})
			.then((result) => {
				if (result.data.products.length > 0) {
					setProducts(result.data.products);
					setLastProductId(result.data.products[result.data.products.length - 1]._id);
					setTotalProductCount(result.data.productCount);
				}
			})
			.catch((error) => {
				console.error(error);
				setUploadError(error);
			})
			.finally(() => {
				setUploadLoad(false);
			});
	}, [srotFilterValue, colorFilterValue, typeFilterValue]);

	useEffect(() => {//productsAll에 상품정보 담기(모든 상품 저장)
		setUploadLoad(true);

		axios
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

	const resetData = () => {
		setName("");
    setPrice("");
    setMainImages([]);
    setPreviews([]);
    setDetails([]);
    setType("");
    setMaterial("");
    setColor("");
	};

	const productContextValue = {
		products, setProducts,
		productsAll, setProductsAll,
		name, setName,
		price, setPrice,
		mainImages, setMainImages,
		previews, setPreviews,
		details, setDetails,
		detailImages, setDetailImages,
		type, setType,
		material, setMaterial,
		color, setColor,
		selectedProduct, setSelectedProduct,
		uploadLoad, setUploadLoad,
		uploadError,
		srotFilterValue, setSrotFilterValue,
		colorFilterValue, setColorFilterValue,
		typeFilterValue, setTypeFilterValue,
		totalProductCount, setTotalProductCount,
		loadMoreProduct,
		toggleClick,
		productDetails,
		resetData,
	};
	
	return (
		<ProductContext.Provider value={productContextValue}>
			{prop.children}
		</ProductContext.Provider>
	)
}