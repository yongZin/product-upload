//상품 리스트 컴포넌트
import React, { useContext, useEffect, useRef } from "react";
import styled from "styled-components";
import { ProductContext } from "../context/ProductContext";
import { ModalContext } from "../context/ModalContext";

const Wrap = styled.div`
	width:100%;
	max-width:750px;
	margin:0 auto;
`;
const Item = styled.ul`
	width:calc(33.333% - 12px);
	width:calc(50% - 12px);
	display:inline-block;
	vertical-align:top;
	margin:0 6px 20px;
	cursor:pointer;
	.item{
		&-image{
			margin-bottom:12px;
			position:relative;
			&:before{
				content:"";
				display:block;
				padding-top:100%;
			}
			img{
				position:absolute;
				inset:0;
			}
		}
		&-name{
			margin-bottom:2px;
			font-size:14px;
		}
		&-price{
			font-size:16px;
			font-family:var(--f-ebold);
		}
	}
`;

const ProductList = () => {
	const {
		products,
		setSelectedProduct,
		uploadLoad,
		uploadError,
		loadMoreProduct
	} = useContext(ProductContext);
	const {setModalView} = useContext(ModalContext);
	const elementRef = useRef();

	useEffect(() => {
		if(!elementRef.current) return;

		const observer = new IntersectionObserver(([entry]) => {
			if(entry.isIntersecting) loadMoreProduct();
		}, {threshold: 0.5});

		observer.observe(elementRef.current);

		return () => observer.disconnect();
	}, [elementRef, loadMoreProduct]);

	const productDetails = (itemID) => {
		const selectedItem = products.find((item) => item._id === itemID);

		setSelectedProduct(selectedItem);
	}
	
	const productList = products.map((item, index) => (
		<Item
			key={item._id}
			ref={index + 1 === products.length ? elementRef : undefined}
			onClick={() => {
				productDetails(item._id);
				setModalView("details");
			}}
		>
			<li className="item-image">
				<img
					key={item.mainImages[0]._id}
					src={`https://yongzin.s3.ap-northeast-2.amazonaws.com/raw/${item.mainImages[0].key}`}
					alt="상품 이미지"
				/>
			</li>

			<li className="item-name">
				{item.name}
			</li>

			<li className="item-price">{item.price}</li>
		</Item>
  ));

	return (
		<Wrap>
			{productList}

			{uploadLoad && <div>LOADING...</div>}
			{uploadError && <p>Error...</p>}
		</Wrap>
	)
}

export default ProductList