//상품 관련 컴포넌트
import React, { createContext, useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";

export const ProductContext = createContext();
export const ProductInfoContext = createContext();
export const ProductQuillContext = createContext();

export const ProductProvider = (prop) => {
	const [products, setProducts] = useState([]);
	const [name, setName] = useState("");
	const [price, setPrice] = useState("");
	const [mainImages, setMainImages] = useState([]);
	const [details, setDetails] = useState([]);
	const [detailImages, setDetailImages] = useState([]);
	const [type, setType] = useState("");
	const [material, setMaterial] = useState("");
	const [color, setColor] = useState("");
	const [selectedProduct, setSelectedProduct] = useState();
	const [uploadURL, setUploadURL] = useState("/upload");
	const [uploadLoad, setUploadLoad] = useState(false);
	const [uploadError, setUploadError] = useState(false);
	const pastUploadUrlRef = useRef();

	const lastProductId = products.length > 0 ? products[products.length - 1]._id : null;

	const loadMoreProduct = useCallback(() => {
		if (uploadLoad || !lastProductId) return;

		setUploadURL(`/upload?lastid=${lastProductId}`);
	}, [lastProductId, uploadLoad]);

	const productContextValue = {
		products, setProducts,
		name, setName,
		price, setPrice,
		mainImages, setMainImages,
		details, setDetails,
		detailImages, setDetailImages,
		type, setType,
		material, setMaterial,
		color, setColor,
		selectedProduct, setSelectedProduct,
		uploadLoad, uploadError,
		loadMoreProduct
	};

	useEffect(() => {
		if(pastUploadUrlRef.current === uploadURL) return;
		
		setUploadLoad(true);

		axios
			.get(uploadURL)
			.then((result) => setProducts((prevData) => [...prevData, ...result.data]))
			.catch((error) => {
				console.error(error);
				setUploadError(error);
			})
			.finally(() => {
				setUploadLoad(false);
				pastUploadUrlRef.current = uploadURL;
			});
	}, [uploadURL]);
	
	return (
		<ProductContext.Provider value={productContextValue}>
			{prop.children}
		</ProductContext.Provider>
	)
}