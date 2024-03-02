//상품 리스트 컴포넌트
import React, { useContext, useEffect, useRef } from "react";
import styled from "styled-components";
import { ProductContext } from "../context/ProductContext";
import { ModalContext } from "../context/ModalContext";
import { AuthContext } from "../context/AuthContext";
const ADMIN_ID = process.env.REACT_APP_ADMIN_ID; //관리자 확인용
const GUEST_ID = process.env.REACT_APP_GUEST_ID; //게스트 확인용

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
		padding-bottom:5px;
		border-bottom:1px solid #e4e4e4;
		li{
			overflow:hidden;
			transition:0.3s;
			&:first-child{
				display:flex;
				justify-content:space-between;
				align-items:flex-start;
				padding-bottom:10px;
				font-size:15px;
				font-family:var(--f-ebold);
				cursor:pointer;
				&:after{
					content:"";
					width:10px;
					height:10px;
					display:inline-block;
					margin:2px 2px 0 0;
					border-right:3px solid #e4e4e4;
					border-bottom:3px solid #e4e4e4;
					transform-origin:center;
					transform:rotate(45deg);
					transition:0.3s;
				}
			}
			&:last-child{
				max-height:0;
			}
			&.on{
				&:after{
					transform:translateY(5px) rotate(-135deg);
				}
				& + li{
					transition:0.6s;
					max-height:400px;
				}
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
			font-size:13px;
			font-family:var(--f-reular);
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
			border-radius:3px;
			overflow:hidden;
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
const UploadBtn = styled.button`
  width:calc(33.333% - 12px);
	display:inline-block;
	vertical-align:top;
	margin:0 6px 20px;
	cursor:pointer;
	background-color:#e6e6e4;
	position:relative;
	border-radius:3px;
	transition:0.2s;
	&:before{
		content: "";
    width:60px;
    height:6px;
		display:block;
		margin:calc(50% - 3px) auto;
    border-radius:5px;
    background-color:#acacac;
    /* background-color:#999; */
	}
	&:after{
		content:"";
		width:6px;
		height:60px;
		border-radius:5px;
    background-color:#acacac;
		position:absolute;
		top:50%;
		left:50%;
		transform:translate(-50%, -50%);
	}
	&:hover{
		background-color:#d6d6d6;
	}
`;
const Loading = styled.div`
	width:35px;
	height:35px;
	display:block;
	margin:0 auto;
	border-radius:50%;
	border:5px solid #eee;
	border-bottom-color:#ccc;
	animation:rotation 0.6s linear infinite;
	@keyframes rotation {
		0%{
			transform:rotate(0deg);
		}
		100%{
			transform:rotate(360deg);
		}
	}
`;

const ProductList = () => {
	const {
		products,
		productsAll,
		uploadError,
		totalProductCount,
		uploadLoad, setUploadLoad,
		srotFilterValue, setSrotFilterValue,
		colorFilterValue, setColorFilterValue,
		typeFilterValue, setTypeFilterValue,
		loadMoreProduct,
		toggleClick,
		productDetails
	} = useContext(ProductContext);
	const {setModalView} = useContext(ModalContext);
	const {userInfo} = useContext(AuthContext);
	const elementRef = useRef();
	const filterSortOption = [
		{ value: "new", label: "신상품순" },
		{ value: "likes", label: "인기순" },
		{ value: "highPrice", label: "높은가격순" },
		{ value: "lowPrice", label: "낮은가격순" },
	];
	const predefinedColorOrder = [
		"red", "orange", "yellow", "saddlebrown", "antiquewhite",
		"green", "blue", "purple", "pink", "white", "gray", "black", "etc"
	];

	useEffect(() => { //infinite scroll
		if(!elementRef.current || uploadLoad) return;

		const observer = new IntersectionObserver(([entry]) => {
			if(entry.isIntersecting) {
				loadMoreProduct();
				setUploadLoad(false);
			}
		}, {threshold: 0.5});

		observer.observe(elementRef.current);

		return () => observer.disconnect();
	}, [elementRef, loadMoreProduct, uploadLoad, setUploadLoad]);

	const filterHandler = (filterType, target) => { //필터 이벤트
		switch (filterType) {
			case "default":
				setSrotFilterValue("new");
				setColorFilterValue("");
				setTypeFilterValue("");

				break;
			case "sort":
				setSrotFilterValue(target);

				break;
			case "color":
				setColorFilterValue(target);

				break;
			case "type":
				setTypeFilterValue(target);

				break;
			default:
				break;
		}
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
						<button type="button" onClick={() => filterHandler("default")}>초기화</button>
					</li>
				</DetailFilterTop>

				<ul>
					<li className="on" onClick={(e) => toggleClick(e)}>상품 정렬</li>
					<li>
						{filterSortOption.map((option) => (
							<FilterRadio key={option.value}>
								<input
									id={option.value}
									type="radio"
									name="filterSrot"
									value={option.value}
									checked={srotFilterValue === option.value}
									onChange={() => {
										filterHandler("sort",option.value);
										setSrotFilterValue(option.value);
									}}
								/>
								<label htmlFor={option.value}>
									<span>{option.label}</span>
								</label>
							</FilterRadio>
						))}
					</li>
				</ul>

				<ul>
					<li className="on" onClick={(e) => toggleClick(e)}>색상</li>
					<li>
						{[...new Set(productsAll.map(item => item["color"]))]
						.filter(color => predefinedColorOrder.includes(color))
						.sort((a, b) => predefinedColorOrder.indexOf(a) - predefinedColorOrder.indexOf(b))
						.map((option) => (
							<FilterRadio
								key={`${option}2`}
								className="colorValue"
							>
								<input
									id={`${option}2`}
									type="radio"
									name="filterColor"
									value={option}
									checked={colorFilterValue === option}
									onChange={() => {
										filterHandler("color", option);
										setColorFilterValue(option);
									}}
								/>
								<label htmlFor={`${option}2`}>
									<span
										style={
											option === "etc"
												? { background: "linear-gradient(to right, red 0%, orange 12%, yellow 24%, green 48%, blue 70%, violet 85%)" }
												: { background: option }
										}
									></span>
								</label>
							</FilterRadio>
						))}
					</li>
				</ul>

				<ul>
					<li className="on" onClick={(e) => toggleClick(e)}>종류</li>
					<li>
						{[...new Set(productsAll.map(item => item["type"]))]
						.sort((a, b) => a.localeCompare(b, 'ko-KR', { numeric: true }))
						.map((option) => (
							<FilterRadio key={`${option}2`}>
								<input
									id={`${option}2`}
									type="radio"
									name="filterType"
									value={option}
									checked={typeFilterValue === option}
									onChange={() => {
										filterHandler("type", option);
										setTypeFilterValue(option);
									}}
								/>
								<label htmlFor={`${option}2`}>
									<span>{option}</span>
								</label>
							</FilterRadio>
						))}
					</li>
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
				<ProductLength>총 <span>{totalProductCount}</span>개 상품</ProductLength>

				{userInfo && 
					((userInfo.userID) === ADMIN_ID ||
					(userInfo.userID) === GUEST_ID) &&

					<UploadBtn type="button" onClick={() => setModalView("upload")} />
				}

				{productList}

				{uploadLoad && <Loading />}
				{uploadError && <p>Error...</p>}
			</ProductListWrap>
		</Wrap>
	)
}

export default ProductList