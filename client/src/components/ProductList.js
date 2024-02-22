//상품 리스트 컴포넌트
import React, { useContext, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { ProductContext } from "../context/ProductContext";
import { ModalContext } from "../context/ModalContext";

const Wrap = styled.div`
	width:100%;
	max-width:1000px;
	margin:0 auto;
	padding:60px 10px;
	font-size:0;
`;
const ProductListWrap = styled.div`
	width:calc(95% - 200px);
	display:inline-block;
	vertical-align:top;
	margin-left:5%;
`;
const DetailFilterTop = styled.ul`
	display:flex;
	justify-content:space-between;
	align-items:center;
	padding-bottom:40px;
	li{
		font-size:18px;
		button{
			font-size:13px;
			color:#777;
			text-decoration:underline;
			text-underline-position:under;
		}
	}
`;
const DetailFilter = styled.div`
	width:200px;
	display:inline-block;
	vertical-align:top;
	padding:10px 4px;
	border-top:4px solid #111;
	position:sticky;
	top:120px;
	ul:not(${DetailFilterTop}){
		margin-bottom:40px;
		padding-bottom:15px;
		border-bottom:1px solid #e4e4e4;
		li{
			&:first-child{
				padding-bottom:10px;
				font-size:15px;
			}
		}
	}
`;
const FilterRadio = styled.div`
	display:inline-block;
	vertical-align:top;
	margin:0 10px 15px 0;
	position:relative;
	input{
		width:1px;
		height:1px;
		margin:-1px;
		overflow:hidden;
		position:absolute;
		clip:rect(0 0 0 0);
		clip-path:polygon(0 0, 0 0, 0 0);
		&:checked{
			& + label{
				color:#fff;
				background-color:#000;
			}
			&#black2{
				& + label{
					background-color:#555;
				}
			}
		}
	}
	label{
		display:block;
		padding:6px;
		font-size:0;
		border-radius:8px;
		border:1px solid #bbb;
		background-color:#e7e7e7;
		box-sizing:border-box;
		transition:0.2s;
		position:relative;
		cursor:pointer;
		span{
			font-size:12px;
		}
		&:hover{
			background-color:#ccc;
		}
	}
	&.colorValue{
		margin-right:8px;
		input{
			&:checked{
				& + label{
					background-color:#000;
					&:before{
						content:"";
						width:5px;
						height:8px;
						border-right:2px solid #111;
						border-bottom:2px solid #111;
						position:absolute;
						top:49%;
						left:50%;
						transform:translate(-50%,-50%) rotate(45deg);
					}
				}
			}
			&#black2,
			&#purple2,
			&#blue2,
			&#red2{
				&:checked{
					& + label{
						&:before{
							border-right:2px solid #fff;
							border-bottom:2px solid #fff;
						}
					}
				}
			}
		}
		label{
			padding:4px;
			border-radius:50%;
			background-color:#ccc;
			span{
				width:20px;
				height:20px;
				display:block;
				font-size:0;
				border-radius:50%;
				transition:0.2s;
			}
			&:hover{
				background-color:#999;
			}
		}
	}
`;
const DetailFilterSelect = styled.div`
	display:none;
`;
const ProductLength = styled.ul`
	padding:10px 6px;
	font-size:14px;
	color:#414141;
	span{
		color:#3498db;
	}
`;
const Item = styled.ul`
	width:calc(33.333% - 12px);
	/* width:calc(50% - 12px); */
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
	const [defaultChecked, setDefaultChecked] = useState("new");
	const filterSortOption = [
		{ value: "new", label: "신상품순" },
		{ value: "likes", label: "인기순" },
		{ value: "highPrice", label: "높은가격순" },
		{ value: "lowPrice", label: "낮은가격순" },
	];

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
	};

	const test = (value) => {
		console.log(value);
	};

	const radioFilters = (value) => {
		let filterItem;
		const predefinedColorOrder = [
			"red", "orange", "yellow", "saddlebrown", "antiquewhite",
			"green", "blue", "purple", "pink", "white", "gray", "black", "etc"
		];

		if (value === "color") {
			filterItem = [...new Set(products.map(item => item[value]))]
				.filter(color => predefinedColorOrder.includes(color))
				.sort((a, b) => predefinedColorOrder.indexOf(a) - predefinedColorOrder.indexOf(b));
		} else{
			filterItem = [...new Set(products.map(item => item[value]))].sort((a, b) => a.localeCompare(b, 'ko-KR', { numeric: true }))
		}

		const filterList = filterItem.map((filterValue, index) => (
			<FilterRadio
				key={filterValue + index}
				className={value === "color" ? "colorValue" : ""}
			>
				<input
					id={filterValue + "2"}
					type="radio"
					name={value}
					value={filterValue}
					onChange={(e) => test(e.target.value)}
				/>
				<label htmlFor={filterValue + "2"}>
					{value === "color" 
						? (
							<span
								style={
									filterValue === "etc"
										? { background: "linear-gradient(to right, red 0%, orange 12%, yellow 24%, green 48%, blue 70%, violet 85%)" }
										: { background: filterValue }
								}
							></span>
						)
						: (
							<span>{filterValue}</span>
						)
					}
				</label>
			</FilterRadio>
		));

		return filterList;
	};
	
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
			<DetailFilter>
				<DetailFilterTop>
					<li>필터</li>
					<li>
						<button type="button">초기화</button>
					</li>
				</DetailFilterTop>

				<ul>
					<li>상품 정렬</li>
					<li>
						{filterSortOption.map((option) => (
							<FilterRadio key={option.value}>
								<input
									id={option.value}
									type="radio"
									name="filterSrot"
									value={option.value}
									checked={defaultChecked === option.value}
									onChange={(e) => {
										test(e.target.value);
										setDefaultChecked(option.value);
									}}
								/>
								<label htmlFor={option.value}>
									<span>{option.label}</span>
								</label>
							</FilterRadio>
						))
						}
					</li>
				</ul>

				<ul>
					<li>색상</li>
					<li>{radioFilters("color")}</li>
				</ul>

				<ul>
					<li>종류</li>
					<li>{radioFilters("type")}</li>
				</ul>
			</DetailFilter>

			<DetailFilterSelect>
				<select name="productIndex" id="productIndex">
					<option value="new">신상품순</option>
					<option value="likes">인기순</option>
					<option value="highPrice">높은가격순</option>
					<option value="lowPrice">낮은가격순</option>
				</select>
			</DetailFilterSelect>

			<ProductListWrap>
				<ProductLength>총 <span>{products.length}</span>개 상품</ProductLength>

				{productList}

				{uploadLoad && <div>LOADING...</div>}
				{uploadError && <p>Error...</p>}
			</ProductListWrap>
		</Wrap>
	)
}

export default ProductList