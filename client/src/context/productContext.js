//상품 데이터
import React, { createContext, useState, useEffect } from "react";
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
	};

	useEffect(() => {
		axios
			.get("/upload")
			.then((result) => setProducts(result.data))
			.catch((error) => console.error(error));
	}, []);
	
	return (
		<ProductContext.Provider value={productContextValue}>
			{prop.children}
		</ProductContext.Provider>
	)
}