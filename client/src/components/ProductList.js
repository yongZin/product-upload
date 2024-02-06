import React, { useContext } from "react";
// import { Link } from "react-router-dom";
import styled from "styled-components";
import { ProductContext } from "../context/productContext";

const Wrap = styled.div`
	width:100%;
	max-width:750px;
	margin:0 auto;
`;
const Item = styled.ul`
	width:calc(33.333% - 12px);
	display:inline-block;
	vertical-align:top;
	margin:0 6px 20px;
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
	const {products} = useContext(ProductContext);
	
	const productList = products.map((item, index) => (
		// <Link to="" key={item._id}>
			<Item key={item._id}>
				<li className="item-image">
					<img
						key={item.mainImages[0]._id}
						src={`http://localhost:4000/uploads/${item.mainImages[0].key}`}
						alt="상품 이미지"
					/>
				</li>

				<li className="item-name">
					{`${item.name}_${(index + 1).toString().padStart(4, '0')}`}
				</li>

				<li className="item-price">{item.price}</li>
			</Item>
		// </Link>
  ));

	return (
		<Wrap>
			{productList}
		</Wrap>
	)
}

export default ProductList