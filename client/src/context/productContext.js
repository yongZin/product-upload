//상품 관련 컴포넌트
import React, { createContext, useState, useEffect, useCallback } from "react";
import axios from "axios";

export const ProductContext = createContext();
export const ProductInfoContext = createContext();
export const ProductQuillContext = createContext();

export const ProductProvider = (prop) => {
	const [products, setProducts] = useState([]); //전체상품
	const [productsList, setProductsList] = useState([]); //상품 리스트용
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
	const [sortFilterValue, setSortFilterValue] = useState("new");
	const [colorFilterValue, setColorFilterValue] = useState("");
	const [typeFilterValue, setTypeFilterValue] = useState("");
	const [totalProductCount, setTotalProductCount] = useState("");
	// const [lastProductId, setLastProductId] = useState("");
	// const [lastProductPrice, setLastProductPrice] = useState();

	// const loadMoreProduct = useCallback(() => {
	// 	if (uploadLoad || !lastProductId) return;

	// 	setUploadLoad(true);

	// 	axios
	// 		.get(`/upload`, {
	// 			params: {
	// 				lastid: lastProductId,
	// 				lastPrice: lastProductPrice,
	// 				sort: sortFilterValue,
	// 				color: colorFilterValue,
	// 				type: typeFilterValue,
	// 			}
	// 		})
	// 		.then((result) => {
	// 			if (result.data.products.length > 0) {
	// 				setProducts((prevData) => [...prevData, ...result.data.products]);
	// 				setLastProductId(result.data.products[result.data.products.length - 1]._id);
	// 				setLastProductPrice(result.data.products[result.data.products.length - 1].price);
	// 				setTotalProductCount(result.data.productCount);

					
	// 				console.log(result.data);
	// 			}
	// 		})
	// 		.catch((error) => {
	// 			console.error(error);
	// 			setUploadError(error);
	// 		})
	// 		.finally(() => {
	// 			setUploadLoad(false);
	// 		});
	// }, [uploadLoad, lastProductId, lastProductPrice, sortFilterValue, colorFilterValue, typeFilterValue]);

	const loadMoreProduct = useCallback(() => {
		if (uploadLoad) return;
		setUploadLoad(true);
		
		const startIndex = productsList.length;
		const endIndex = startIndex + 6;
		const newProducts = products.slice(startIndex, endIndex);
		
		setProductsList((prevProducts) => [...prevProducts, ...newProducts]);
		setUploadLoad(false);
	}, [uploadLoad, products, productsList]);

	useEffect(() => {
		setProducts([]);
		// setLastProductId(null);
		setTotalProductCount(0);

		setUploadLoad(true);

		axios
			.get(`/upload`, {
				params: {
					sort: sortFilterValue,
					color: colorFilterValue,
					type: typeFilterValue,
				}
			})
			.then((result) => {
				if (result.data.products.length > 0) {
					setProducts(result.data.products);
					// setLastProductId(result.data.products[result.data.products.length - 1]._id);
					// setLastProductPrice(result.data.products[result.data.products.length - 1].price);
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
	}, [sortFilterValue, colorFilterValue, typeFilterValue]);

	useEffect(() => {
    const initialProducts = products.slice(0, 6);
    setProductsList(initialProducts);
	}, [products]);

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
    setPreviews([]);
		setName("");
    setPrice("");
    setMainImages([]);
		setDetailImages([]);
    setDetails([]);
    setType("");
    setMaterial("");
    setColor("");
	};

	const productContextValue = {
		products, setProducts,
		productsList, setProductsList,
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
		sortFilterValue, setSortFilterValue,
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