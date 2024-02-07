import React, { useContext } from "react";
// import styled from "styled-components";
import { ProductContext } from "../context/ProductContext";

const Details = () => {
	const {selectedProduct} = useContext(ProductContext);

	const details = selectedProduct.details.slice(",");
	// const detail = details.map(() => {
	// 	<p></p>
	// });

	return (
		<div>
			<p>{selectedProduct.name}</p>
			<p>{selectedProduct.price}</p>
			<p>{details}</p>
			<p>{selectedProduct.type}</p>
			<p>{selectedProduct.material}</p>
			<p>{selectedProduct.color}</p>
		</div>
	)
}

export default Details