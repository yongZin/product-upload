//상품 관련 컴포넌트
import React, { createContext, useState, useEffect, useRef, useCallback } from "react";
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
	const [details, setDetails] = useState([]);
	const [detailImages, setDetailImages] = useState([]);
	const [type, setType] = useState("");
	const [material, setMaterial] = useState("");
	const [color, setColor] = useState("");
	const [selectedProduct, setSelectedProduct] = useState();
	// const [uploadURL, setUploadURL] = useState("/upload");
	const [uploadLoad, setUploadLoad] = useState(false);
	const [uploadError, setUploadError] = useState(false);
	const [srotFilterValue, setSrotFilterValue] = useState("new");
	const [colorFilterValue, setColorFilterValue] = useState("");
	const [typeFilterValue, setTypeFilterValue] = useState(null);
	const [lastProductId, setLastProductId] = useState("");
	// const pastUploadUrlRef = useRef();

	const loadMoreProduct = useCallback(() => {
		if (uploadLoad || !lastProductId) return;

		setUploadLoad(true);

		axios
			.get(`/upload`, {
				params: {
					lastid: lastProductId,
					color: colorFilterValue,
					type: typeFilterValue,
				}
			})
			.then((result) => {
				if (result.data.length > 0) {
					setProducts((prevData) => [...prevData, ...result.data]);
					setLastProductId(result.data[result.data.length - 1]._id);
				}
			})
			.catch((error) => {
				console.error(error);
				setUploadError(error);
			})
			.finally(() => {
				setUploadLoad(false);
			});
}, [lastProductId, uploadLoad, colorFilterValue, typeFilterValue]);

	useEffect(() => {
		setProducts([]);
		setLastProductId(null);

		setUploadLoad(true);

		axios
			.get(`/upload`, {
				params: {
					color: colorFilterValue,
					type: typeFilterValue,
				}
			})
			.then((result) => {
				if (result.data.length > 0) {
					setProducts(result.data);
					setLastProductId(result.data[result.data.length - 1]._id);
				}
			})
			.catch((error) => {
				console.error(error);
				setUploadError(error);
			})
			.finally(() => {
				setUploadLoad(false);
			});
	}, [colorFilterValue, typeFilterValue]);





	

	// const loadMoreProduct = useCallback(() => {
	// 	if (uploadLoad || !lastProductId) return;

	// 	setUploadURL(`/upload?lastid=${lastProductId}`);
	// }, [lastProductId, uploadLoad]);

	// useEffect(() => {
  //   if (!lastProductId || pastUploadUrlRef.current === uploadURL) return;
	
	// 	loadMoreProduct();
	// }, [uploadURL, lastProductId, loadMoreProduct]);

	// useEffect(() => {
	// 	setProducts([]);
	// 	setLastProductId(null);
	// }, [colorFilterValue, typeFilterValue]);

	// useEffect(() => {
	// 	setUploadLoad(true);
	
	// 	axios
	// 		.get(`/upload?lastid=${lastProductId}`, {
	// 			params: {
	// 				color: colorFilterValue,
	// 				type: typeFilterValue,
	// 			}
	// 		})
	// 		.then((result) => {
	// 			setProducts((prevData) => [...prevData, ...result.data]);
	
	// 			if (result.data.length > 0) {
	// 				setLastProductId(result.data[result.data.length - 1]._id);
	// 			}
	// 		})
	// 		.catch((error) => {
	// 			console.error(error);
	// 			setUploadError(error);
	// 		})
	// 		.finally(() => {
	// 			setUploadLoad(false);
	// 			pastUploadUrlRef.current = uploadURL;
	// 		});
	// }, [colorFilterValue, typeFilterValue])

	// useEffect(() => { //products에 상품정보 담기(상품 6개씩 저장)
	// 	if(pastUploadUrlRef.current === uploadURL) return;

	// 	setUploadLoad(true);

	// 	axios
	// 		.get(uploadURL)
	// 		.then((result) => {
	// 			setProducts((prevData) => [...prevData, ...result.data]);

	// 			if (result.data.length > 0) {
	// 				setLastProductId(result.data[result.data.length - 1]._id);
	// 			}
	// 		})
	// 		.catch((error) => {
	// 			console.error(error);
	// 			setUploadError(error);
	// 		})
	// 		.finally(() => {
	// 			setUploadLoad(false);
	// 			pastUploadUrlRef.current = uploadURL;
	// 		});
	// }, [uploadURL]);

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

	const productContextValue = {
		products, setProducts,
		productsAll, setProductsAll,
		name, setName,
		price, setPrice,
		mainImages, setMainImages,
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
		loadMoreProduct,
	};
	
	return (
		<ProductContext.Provider value={productContextValue}>
			{prop.children}
		</ProductContext.Provider>
	)
}