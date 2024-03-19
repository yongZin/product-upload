//상품 리스트 컴포넌트
import React, { useContext, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import classnames from 'classnames';
import { ProductContext } from "../context/ProductContext";
import { ModalContext } from "../context/ModalContext";
import { AuthContext } from "../context/AuthContext";
const ADMIN_ID = process.env.REACT_APP_ADMIN_ID; //관리자 확인용
const GUEST_ID = process.env.REACT_APP_GUEST_ID; //게스트 확인용

const MobileFilter = styled.div`
	display:none;
	@media ${props => props.theme.mobile} {
		display:block;
		margin-bottom:30px;
		padding:10px;
		background-color:#fff;
		box-shadow:0 1px 10px rgba(0,0,0,0.2);
		position:sticky;
		top:64px;
		z-index:9;
		&:before{
			content:"";
			width:100%;
			height:64px;
			background-color:#fff;
			position:absolute;
			top:-64px;
			left:0;
			z-index:5;
		}
		div{
			display:inline-block;
			vertical-align:middle;
			button{
				display:inline-block;
				vertical-align:middle;
				padding:8px 12px;
				font-size:14px;
				border-radius:50px;
				border:1px solid #ededed;
				background-color:#fff;
				color:#444;
				transition:0.2s;
				&:hover{
					background-color:#ddd;
				}
			}
			&.mobile{
				&-reset{
					width:80px;
					&:after{
						content:"";
						width:1px;
						height:16px;
						display:inline-block;
						vertical-align:middle;
						margin:0 8px;
						background-color:#ddd;
					}
				}
				&-filter{
					width:calc(100% - 80px);
					overflow-x:auto;
					overflow-y:hidden;
					scrollbar-width:none;
					div{
						width:max-content;
						button{
							&:after{
								content:"";
								width:6px;
								height:6px;
								display:inline-block;
								vertical-align:top;
								margin:2px 0 0 5px;
								border-right:1px solid #bbb;
								border-bottom:1px solid #bbb;
								transform:rotate(45deg);
							}
							& + button{
								margin-left:6px;
							}
							&.on{
								color:#fff;
								background-color:#111;
								&:after{
									border-color:#fff;
								}
							}
						}
					}
				}
			}
		}
	}
	@media ${props => props.theme.mobile_xs} {
		padding:6px 10px;
		top:58px;
		&:before{
			height:58px;
			top:-58px;
		}
		div{
			button{
				padding:6px 10px;
				font-size:13px;
			}
			&.mobile{
				&-reset{
					width:73px;
				}
				&-filter{
					width:calc(100% - 73px);
				}
			}
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
	ul{
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
	.filter{
		&-controls{
			display:flex;
			justify-content:space-between;
			align-items:center;
			padding-bottom:40px;
			p{
				font-size:18px;
			}
			div{
				button{
					font-size:13px;
					color:#777;
					text-decoration:underline;
					text-underline-position:under;
					&:last-child{
						display:none;
					}
				}
			}
		}
	}
	@media ${props => props.theme.tablet} {
		width:160px;
		ul{
			li{
				&:first-child{
					font-size:14px;
					&:after{
						width:8px;
						height:8px;
					}
				}
			}
		}
  }
	@media ${props => props.theme.mobile} {
		width:100%;
		height:450px;
		max-height:50%;
		display:block;
		padding:20px 0 60px;
		border:0;
		background-color:#fff;
		border-radius:10px 10px 0 0;
		transition:0.3s;
		position:fixed;
		top:auto;
		bottom:-100%;
		z-index:12;
		>div:not(.filter-controls){
			height:calc(100% - 50px);
			padding:15px;
			border-top:1px solid #ddd;
			border-bottom:1px solid #ddd;
			overflow:auto;
			ul{
				margin:0;
				padding:20px 0;
				border-bottom:0;
				li{
					&:first-child{
						cursor:default;
						&:after{
							display:none;
						}
					}
					&:last-child{
						max-height:100%;
					}
					&.on{
						& + li{
							max-height:100%;
						}
				}
				}
				& + ul{
					border-top:1px solid #e4e4e4;
				}
			}
		}
		.filter{
			&-controls{
				padding:0;
				p{
					width:100%;
					padding-bottom:20px;
					text-align:center;
				}
				div{
					width:100%;
					text-align:center;
					position:absolute;
					left:0;
					bottom:15px;
					button{
						width:25%;
						display:inline-block !important;
						vertical-align:middle;
						padding:10px 0;
						font-size:16px;
						border-radius:6px;
						border:1px solid #ccc;
						background-color:rgba(255, 255, 255, 0.5);
						text-decoration:none;
						transition:0.3s;
						&:last-child{
							margin-left:10px;
							color:#fff;
							background-color:#333;
						}
					}
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
	@media ${props => props.theme.tablet} {
		margin:0 4px 8px 0;
		label{
			padding:7px;
			border-radius:15px;
			span{
				font-size:13px;
			}
		}
  }
	@media ${props => props.theme.mobile} {

	}
`;
const ProductListWrap = styled.div`
	width:calc(95% - 200px);
	display:inline-block;
	vertical-align:top;
	margin-left:5%;
	@media ${props => props.theme.tablet} {
		width:calc(95% - 160px);
  }
	@media ${props => props.theme.mobile} {
		width:100%;
		display:block;
		margin:0;
	}
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
	@media ${props => props.theme.tablet} {
		width:calc(50% - 12px);
  }
	@media ${props => props.theme.mobile_xs} {
		width:90%;
		max-width:320px;
		display:block;
		margin:0 auto 40px;
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
	@media ${props => props.theme.tablet} {
		width:calc(50% - 12px);
  }
	@media ${props => props.theme.mobile_xs} {
		width:90%;
		max-width:320px;
		display:block;
		margin:0 auto 40px;
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
const Wrap = styled.section`
	width:100%;
	max-width:1000px;
	margin:0 auto;
	padding:60px 10px;
	font-size:0;
	@media ${props => props.theme.mobile} {
		padding:0 0 60px;
		&.background{
			&:before{
				content:"";
				background-color:rgba(0,0,0,0.5);
				animation:opacity 0.3s linear;
				position:fixed;
				inset:0;
				z-index:11;
			}
			${(DetailFilter)}{
				bottom:0;
			}
		}
		@keyframes opacity {
			0%{
				opacity:0;
			}
			100%{
				opacity:1;
			}
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
		sortFilterValue, setSortFilterValue,
		colorFilterValue, setColorFilterValue,
		typeFilterValue, setTypeFilterValue,
		loadMoreProduct,
		toggleClick,
		productDetails
	} = useContext(ProductContext);
	const {setModalView} = useContext(ModalContext);
	const {userInfo} = useContext(AuthContext);
	const [mobileFilter, setMobileFilter] = useState(false);
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

	useEffect(() => {
		if (mobileFilter) {
			document.body.classList.add("scroll-fix");
		} else{
			document.body.classList.remove("scroll-fix");
		}
	}, [mobileFilter])

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
				setSortFilterValue("new");
				setColorFilterValue("");
				setTypeFilterValue("");

				break;
			case "sort":
				setSortFilterValue(target);

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

			<li className="item-price">{item.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</li>
		</Item>
  ));

	return (
		<Wrap
			className={mobileFilter ? "background" : ""}
			onClick={(e) => {
				if (e.target.classList.contains("background")) {
					e.target.classList.remove("background");
					document.body.classList.remove("scroll-fix");
					setMobileFilter(false);
				}
			}}
		>
			<MobileFilter>
				<div className="mobile-reset">
					<button type="button" onClick={() => filterHandler("default")}>초기화</button>
				</div>

				<div className="mobile-filter">
					<div>
						<button
							type="button"
							className={classnames({ on: sortFilterValue})}
							onClick={() => setMobileFilter(true)}
						>
							상품정렬
						</button>

						<button
							type="button"
							className={classnames({ on: colorFilterValue})}
							onClick={() => setMobileFilter(true)}
						>
							색상
						</button>

						<button
							type="button"
							className={classnames({ on: typeFilterValue})}
							onClick={() => setMobileFilter(true)}
						>
							종류
						</button>
					</div>
				</div>
			</MobileFilter>

			<DetailFilter>
				<div className="filter-controls">
					<p>필터</p>
					<div>
						<button type="button" onClick={() => filterHandler("default")}>초기화</button>
						<button type="button" onClick={() => setMobileFilter(false)}>닫기</button>
					</div>
				</div>

				<div>
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
										checked={sortFilterValue === option.value}
										onChange={() => {
											filterHandler("sort",option.value);
											setSortFilterValue(option.value);
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
				</div>
			</DetailFilter>

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