import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";

const Wrap = styled.div`
	width:100%;
	display:flex;
	justify-content:space-between;
	max-width:750px;
	margin:0 auto;
`;
const Item = styled.ul`
	width:calc(33.333% - 10px);
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
	const [products, setProducts] = useState([]);

	useEffect(() => {
		axios
			.get("/upload")
			.then((result) => setProducts(result.data))
			.catch((error) => console.error(error));
	}, []);

	const productList = products.map((item, index) => (
		// <Link to="" key={item._id}>
			<Item key={item._id}>
				<li className="item-image">
					<img
						key={item.mainImages[0]._id}
						src={`http://localhost:4000/uploads/${item.mainImages[0].key}`}
						alt={item.name}
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