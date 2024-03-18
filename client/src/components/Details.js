//상품 상세화면 컴포넌트
import React, { useContext, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { toast } from "react-toastify";
import { AuthContext } from "../context/AuthContext"
import { ProductContext } from "../context/ProductContext";
import { ModalContext } from "../context/ModalContext";
import { AiOutlineHeart, AiFillHeart, AiTwotoneShopping } from "react-icons/ai";
import { TbTrash, TbTrashX } from "react-icons/tb";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import logo from "./images/logo-xs.svg";
const ADMIN_ID = process.env.REACT_APP_ADMIN_ID; //관리자 확인용
const GUEST_ID = process.env.REACT_APP_GUEST_ID; //게스트 확인용

const TopText = styled.div`
	padding:20px 0 0 10px;
	border-top:2px solid rgba(0,0,0,0.1);
	p{
		font-size:24px;
		&:first-child{
			padding-bottom:8px;
			font-size:18px;
		}
		&.price{
			font-family:var(--f-ebold);
			&:after{
				content:"원";
				display:inline-block;
				vertical-align:middle;
				margin-left:3px;
				font-size:0.7em;
				font-family:var(--f-bold);
			}
		}
	}
	@media ${props => props.theme.tablet} {
		padding:14px 0 0 10px;
		p{
			font-size:20px;
			&:first-child{
				font-size:16px;
			}
		}
	}
	@media ${props => props.theme.mobile} {
		border-top:0;
	}
`;
const TopEtc =  styled.div`
	margin:20px 0;
	padding:20px 0 20px 10px;
	border-top:1px solid rgba(0,0,0,0.07);
	border-bottom:1px solid rgba(0,0,0,0.07);
	>p{
		padding-top:20px;
		font-size:14px;
		color:#515151;
	}
	@media ${props => props.theme.tablet} {
		margin:10px 0;
		padding:15px 0 15px 10px;
	}
	
`;
const TopBtn =  styled.div`
	display:flex;
	justify-content:space-between;
	align-items:center;
	button{
		width:50px;
		height:50px;
    border-radius:6px;
		border:1px solid #ccc;
    background-color:rgba(255, 255, 255, 0.5);
		position:relative;
	}
	@media ${props => props.theme.tablet} {
		button{
			width:40px;
			height:40px;
		}
	}
`;
const LikeBtn = styled.button`
	svg{
		display:inline-block;
		vertical-align:top;
		font-size:41px;
		color:#777;
		transition:0.2s;
		&.like{
			color:rgba(255,0,0,0.7) !important;
			& + span{
				color:#f4f4f4;
				pointer-events:none;
			}
		}
	}
	span{
		font-size:10px;
		color:#666;
		letter-spacing:-0.7px;
		position:absolute;
		top:50%;
		left:50%;
		transform:translate(-50%, -50%);
		transition:0.2s;
	}
	&:hover{
		svg{
			color:rgba(255,0,0,0.5);
		}
	}
	@media ${props => props.theme.tablet} {
		svg{
			font-size:34px;
		}
	}
`;
const ShoppingBtn = styled.button`
	svg{
		font-size:38px;
		color:#777;
		path{
			transition:0.2s;
			&:first-child{
				fill:transparent;
			}
		}	
	}
	&:hover{
		svg{
			path{
				&:first-child{
					fill:#bbb;
				}
			}
		}
	}
	@media ${props => props.theme.tablet} {
		svg{
			font-size:34px;
		}
	}
`;
const DeleteBtn = styled.button`
	display:none;
	position:relative;
	svg{
		font-size:35px;
		color:#666;
		position:absolute;
		top:50%;
		left:50%;
		transform:translate(-50%, -50%);
		&:last-child{
			opacity:0;
		}
	}
	&:hover{
		svg{
			opacity:0;
			&:last-child{
				opacity:1;
			}
		}
	}
	@media ${props => props.theme.tablet} {
		svg{
			font-size:32px;
		}
	}
`;
const OrderBtn = styled.button`
	width:calc(100% - 108px) !important;
	font-size:18px;
	color:#f4f4f4;
	border:1px solid #333 !important;
	background-color:#333 !important;
	transition:0.2s;
	&:hover{
		border:1px solid #555 !important;
		background-color:#555 !important;
	}
	@media ${props => props.theme.tablet} {
		width:calc(100% - 92px) !important;
		font-size:16px;	
	}
	@media ${props => props.theme.mobile} {
		font-size:15px;	
	}
`;
const MoreBtn = styled.button`
	display:none;
	width:100%;
	padding:10px 30px;
	font-size:16px;
	border-radius:0 0 4px 4px;
	color:#fff;
	background-color:rgba(0,0,0,0.5);
	backdrop-filter:blur(3px);
	position:absolute;
	bottom:0;
	left:0;
	&:after{
		content:"";
		width:8px;
		height:8px;
		display:inline-block;
		vertical-align:text-top;
		margin:2px 0 0 8px;
		border-bottom:2px solid;
		border-right:2px solid;
		transform:rotate(45deg);
	}
	@media ${props => props.theme.mobile} {
		font-size:14px;
		&:after{
			width:6px;
			height:6px;
		}
	}
`;
const ColorBox = styled.div`
	position:relative;
	span{
		width:20px;
		height:20px;
		border-radius:50%;
		position:absolute;
		inset:5px;
	}
	&:before{
		content:"";
		width:30px;
		height:30px;
		display:inline-block;
		vertical-align:middle;
		border-radius:50%;
		border:1px solid #bbb;
		background-color:#ccc;
		box-sizing:border-box;
	}
`;
const Wrap = styled.div`
	height:100%;
	overflow:auto;
	&.admin{ //임시관리자(게스트)는 관리자가 업로드한 상품 삭제 불가
		${DeleteBtn}{
			display:inline-block;
			vertical-align:middle;
		}
		${ShoppingBtn}{
			display:none;
		}
	}
	&.disabled{
		${DeleteBtn}{
			position:relative;
			&:before{
				content:"임시관리자가 삭제할 수 없는 상품입니다.";
				width:130px;
				padding:5px;
				font-size:12px;
				border-radius: 6px;
				border:1px solid rgba(0, 0, 0, 0.1);
				color: #333;
				background-color:#c2c2c2;
				position:absolute;
				top:-44px;
				left:0;
				box-sizing: border-box;
				opacity:0;
				transition:0.2s;
				pointer-events:none;
			}
			&:after{
				content:"";
				width:7px;
				height:7px;
				background-color:#c2c2c2;
				transform:rotate(45deg);
				position:absolute;
				top:-7px;
				left:20px;
				border-bottom:1px solid rgba(0, 0, 0, 0.1);
				border-right:1px solid rgba(0, 0, 0, 0.1);
				opacity:0;
				transition:0.2s;
				pointer-events:none;
			}
			&:hover{
				&:before{
					top:-51px;
					opacity:1;
				}
				&:after{
					top:-14px;
					opacity:1;
				}
				svg{
				opacity:1;
				&:last-child{
					opacity:0;
				}
			}
			}
		}
	}
`;
const TopImages = styled(Swiper)`
	width:45%;
	display:inline-block;
	vertical-align:top;
	font-size:0;
	position:relative;
	.swiper{
		&-button{
			&-prev,
			&-next{
				width:35px;
				height:35px;
				color:#000;
				background-color:rgba(0,0,0,0.1);
				z-index:1000;
				&:after{
					font-size:15px;
				}
			}
			&-prev{
				left:0;
			}
			&-next{
				right:0;
			}
		}
		&-pagination{
			&-bullet{
				width:20px;
				height:4px;
				margin:0 2px !important;
				border-radius:2px;
				background:#555;
				&-active{
					background:#555;
				}
			}
		}
	}
	img{
		width:100%;
	}
	@media ${props => props.theme.tablet} {
		border:1px solid rgba(201, 201, 201, 0.5);
	}
	@media ${props => props.theme.mobile} {
		width:100%;
		display:block;
	}
`;
const TopInfo = styled.div`
	width:55%;
	display:inline-block;
	vertical-align:top;
	padding-left:20px;
	font-size:0;
	@media ${props => props.theme.mobile} {
		width:100%;
		display:block;
		padding:0;
	}
`;
const ProductInfo = styled.div`
	padding:30px 0;
	font-size:0;
	border-radius:4px;
	background-color:rgba(0,0,0,0.1);
	overflow:hidden;
	position:relative;
	>div{
		width:75%;
		max-width:500px;
		margin:0 auto;
		p{
			line-height:1.3;
			font-size:16px;
			font-family:var(--f-reular);
			word-break:keep-all;
			strong{
				display:block;
				padding:30px 0 8px;
				font-size:22px;
				font-family:var(--f-ebold);
			}
			img{
				display:block;
				padding:30px 0;
			}
		}
	}
	&.on{
		max-height:800px;
		${(MoreBtn)}{
			display:block;
		}
	}
	@media ${props => props.theme.tablet} {
		padding:20px 0;
		>div{
			p{
				font-size:15px;
				strong{
					font-size:20px;
				}
			}
		}
	}
	@media ${props => props.theme.mobile} {
		>div{
			width:85%;
		}
	}
`;
const DetailTitle = styled.p`
	padding:50px 10px 30px;
	font-size:18px;
	text-align:center;
	&:before{
		content:"";
		width:30px;
		height:2px;
		display:block;
		margin:0 auto 15px;
		background-color:rgba(0,0,0,0.1);
	}
	@media ${props => props.theme.mobile} {
		padding:40px 10px 20px;
	}
`;
const ProductDetail = styled.div`
	margin-top:40px;
	border-radius:4px;
	background-color:rgba(0,0,0,0.1);
	ul{
		width:100%;
		display:flex;
		align-items:center;
		border-bottom:1px solid #ccc;
		li{
			width:25%;
			padding:15px 20px;
			font-size:14px;
			color:#414141;
			&:last-child{
				width:75%;
				line-height:1.25;
				border-left:1px solid #ccc;
				word-break:keep-all;
			}
		}
		&:last-child{
			border-bottom:0;
		}
	}
	@media ${props => props.theme.tablet} {
		ul{
			border-color:#eee;
			li{
				&:last-child{
					border-color:#eee;
				}
			}
		}
	}
`;
const BrandStory = styled.div`
	margin-top:20px;
	padding:10px;
	border-radius:4px;
	background-color:rgba(0,0,0,0.1);
	&:before{
		content:"";
		width:60px;
		height:60px;
		display:inline-block;
		vertical-align:middle;
		border-radius:4px;
		background:url(${logo}) no-repeat;
		background-size:cover;
		overflow:hidden;
	}
	ul{
		width:calc(100% - 60px);
		display:inline-block;
		vertical-align:middle;
		padding-left:14px;
		li{
			font-size:12px;
			color:#333;
			&:first-child{
				font-size:14px;
				padding-bottom:2px;
			}
			button{
				margin-top:8px;
				padding:3px 8px;
				font-size:11px;
				border-radius:4px;
				background-color:rgba(255, 255, 255, 0.5);
			}
		}
	}
	@media ${props => props.theme.mobile} {
		margin-top:50px;
		position:relative;
		ul{
			width:calc(100% - 96px);
			li{
				button{
					width:60px;
					height:100%;
					margin:0;
					padding:8px;
					font-size:0;
					border-radius:50%;
					background-color:transparent;
					position:absolute;
					top:50%;
					right:0;
					transform:translateY(-50%);
					&:before{
						content:"";
						width:12px;
						height:12px;
						display:block;
						margin:0 12px 0 auto;
						border-top:3px solid #666;
						border-right:3px solid #666;
						transform:rotate(45deg);
					}
				}
			}
		}
	}
	@media ${props => props.theme.mobile_xs} {
		&:before{
			width:50px;
			height:50px;
		}
		ul{
			width:calc(100% - 86px);
		}
	}
`;
const CloseBtn = styled.button`
	width:30px;
	height:30px;
	border-radius:50%;
	background-color:rgba(0,0,0,0.1);
	position:absolute;
	bottom:15px;
	left:50%;
	transform:translateX(-50%);
	transition:0.3s;
	&:before,&:after{
		content:"";
		width:40%;
		height:2px;
		border:0;
		background-color:#fff;
		position:absolute;
		top:50%;
		left:50%;
		transform-origin:center;
		transform:translate(-50%, -50%) rotate(45deg);
	}
	&:after{
		transform:translate(-50%, -50%) rotate(-45deg);
	}
	&:hover{
 		background-color:rgba(0,0,0,0.2);
 	}
	@media ${props => props.theme.tablet} {
		bottom:10px;
	}
`;
const Recommend = styled(Swiper)`
	margin-bottom:20px;
	padding:30px 20px;
	border-radius:4px;
	background-color:rgba(0,0,0,0.1);
	position:relative;
	.swiper{
		&-slide{
			ul{
				font-size:0;
				cursor:pointer;
				li{
					&.item{
						&-image{
							margin-bottom:10px;
							border-radius:3px;
							position:relative;
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
				}
			}
		}
		&-button{
			&-prev,
			&-next{
				width:35px;
				height:35px;
				color:#000;
				background-color:rgba(0,0,0,0.1);
				z-index:1000;
				&:after{
					font-size:15px;
				}
			}
			&-prev{
				left:0;
			}
			&-next{
				right:0;
			}
		}
		&-pagination{
			&-bullet{
				width:20px;
				height:4px;
				margin:0 2px !important;
				border-radius:2px;
				background:#555;
				&-active{
					background:#555;
				}
			}
		}
	}
`;

const Details = () => {
	const {userInfo} = useContext(AuthContext);
	const {
		products, setProducts,
		productsAll, setProductsAll,
		selectedProduct,
		productDetails,
	} = useContext(ProductContext);
	const {setModalView, handleClose} = useContext(ModalContext);
	const [product, setProduct] = useState();
	const [recommendedProducts, setRecommendedProducts] = useState();
	const [hasLiked, setHasLiked] = useState(false);
	const [error, setError] = useState(false);
	const wrapRef = useRef();
	const productId = selectedProduct._id;
	
	useEffect(() => { //선택한 상품 정보 DB에서 찾아오기
		const item = products.find((item) => item._id === productId);
		
		if (item) {
			const updatedDetails = item.details.map((detail) => {
				const findImg = /<img src="">/g;

				let detailIndex = 0;

				const updatedDetail = detail.replace(findImg, () => {
					const replacement = `<img src="https://yongzin.s3.ap-northeast-2.amazonaws.com/raw/${item.detailImages[detailIndex].key}">`;

					detailIndex++;

					return replacement;
				});

				return updatedDetail;
			});

			setProduct((prevProduct) => ({
				...prevProduct,
				...item,
				details: updatedDetails,
			}));
			setError(false);
		} else {
			setError(true);
		}
	}, [products, productId]);

	useEffect(() => { //추천상품 불러오기(현재 상품을 제외한 같은 종류의 상품)
		if (product) {
				const filteredProducts = products.filter((item) => item.type === product.type && item._id !== product._id);

				setRecommendedProducts(filteredProducts.slice(0, 6));
		}
	}, [product, products, setRecommendedProducts]);

	useEffect(() => { //좋아요 유무 확인
		if (
			userInfo
			&& selectedProduct
			&& selectedProduct.likes.includes(userInfo.userID)
			) {
				setHasLiked(true);
		}

	}, [userInfo, selectedProduct]);

	if (error) return <h3>Error...</h3>;
	else if (!product) return <h3>Loading...</h3>;

	const likeHandler = async () => { //좋아요 이벤트
		if(!userInfo) {
			handleClose();

			setTimeout(() => {
				setModalView("login");
			}, 300)

			return;
		}

		const result = await axios.patch(`/upload/${productId}/${hasLiked ? "unlike" : "like"}`);

		setProducts([
			...products.filter((product) => product._id !== productId),
			result.data
		].sort((a, b) => {
			if(a._id < b._id) return 1;
			else return -1;
		}));

		setHasLiked(!hasLiked);
	};

	const shoppingHandler = () => { //장바구니 이벤트(추후 개발 예정)
		if(!userInfo) {
			handleClose();

			setTimeout(() => {
				setModalView("login");
			}, 300)

			return;
		}
	};

	const deleteHandler = async () => { //상품 삭제 이벤트
		try {
			if(!window.confirm("정말 삭제 하시겠습니까?")) return;
			
			handleClose();

			setTimeout(async () => {
				const result = await axios.delete(`/upload/${productId}`);
				toast.success(result.data.message);
				
				setProducts(products.filter(product => product._id !== productId)); //삭제후 바로 리스트에서 제거
				setProductsAll(productsAll.filter(product => product._id !== productId));
			}, 300)

		} catch (err) {
			console.error(err.message);
		}
	};

	const orderHandler = () => { //구매 이벤트(추후 개발 예정)
		if(!userInfo) {
			handleClose();

			setTimeout(() => {
				setModalView("login");
			}, 300)

			return;
		}
	};

	return (
		<Wrap
			ref={wrapRef}
			className={
				(userInfo && (userInfo.userID === GUEST_ID || userInfo.userID === ADMIN_ID))
					? (selectedProduct.user._id === ADMIN_ID
						? (userInfo.userID === GUEST_ID)
							? "admin disabled" // 임시관리자(게스트)는 관리자가 업로드한 상품 삭제 불가
							: "admin" // 관리자, 임시관리자 로그인 시
						: "admin")
					: ""
			}
		>
			<div>
				<TopImages
					modules={[Navigation, Pagination]}
					slidesPerView={1}
					loop={true}
					pagination={{ clickable: true }}
					navigation
				>
					{selectedProduct.mainImages.map((image) => (
						<SwiperSlide key={image.key}>
							<img
								src={`https://yongzin.s3.ap-northeast-2.amazonaws.com/raw/${image.filename}`}
								alt="상품 대표 이미지"
							/>
						</SwiperSlide>
					))}
				</TopImages>

				<TopInfo>
					<TopText>
						<p>{product.name}</p>
						<p className="price">{product.price}</p>
					</TopText>

					<TopEtc>
						<ColorBox>
							<span
								style={
									product.color === "etc"
										? { background: "linear-gradient(to right, red 0%, orange 12%, yellow 24%, green 48%, blue 70%, violet 85%)" }
										: { background: product.color }
								}
							></span>
						</ColorBox>

						<p>무료배송</p>
					</TopEtc>

					<TopBtn>
						<LikeBtn onClick={likeHandler}>
							{hasLiked
								? <AiFillHeart className="like" />
								: <AiOutlineHeart />
							}
							<span>
								{
									(product.likes.length > 999)
									? "+999"
									: product.likes.length
								}
							</span>
						</LikeBtn>

						<ShoppingBtn onClick={shoppingHandler}>
							<AiTwotoneShopping />
						</ShoppingBtn>

						<DeleteBtn
							onClick={
								//임시관리자(게스트)는 관리자가 업로드한 상품 삭제 불가
								(userInfo && (userInfo.userID === GUEST_ID)) &&
								(selectedProduct.user._id === ADMIN_ID) ? undefined : deleteHandler
							}
						>
							<TbTrash />
							<TbTrashX />
						</DeleteBtn>

						<OrderBtn onClick={orderHandler}>구매하기</OrderBtn>
					</TopBtn>
				</TopInfo>
			</div>

			<div>
				<BrandStory>
					<ul>
						<li>프라이탁</li>
						<li>오래된 트럭 방수포로 만들어진 실용적이고 도시적인 감각의 가방</li>
						<li>
							<button type="button">BRAND STORY</button>
						</li>
					</ul>
				</BrandStory>

				<DetailTitle>상품 정보</DetailTitle>

				<ProductInfo className="on">
					{product.details.map((content, index) => (
						<div key={index} dangerouslySetInnerHTML={{ __html: content }} />
					))}

					<MoreBtn
						type="button"
						onClick={(e) => {
							e.target.parentElement.classList.toggle("on")
						}}
					>
						더보기
					</MoreBtn>
				</ProductInfo>
			</div>

			<div>
				<ProductDetail>
					<ul>
						<li>종류</li>
						<li>{product.type}</li>
					</ul>

					<ul>
						<li>소재</li>
						<li>{product.material}</li>
					</ul>

					<ul>
						<li>제조자</li>
						<li>프라이탁</li>
					</ul>

					<ul>
						<li>제조국</li>
						<li>스위스</li>
					</ul>

					<ul>
						<li>취급시 주의사항</li>
						<li>뜨거운 곳에 장시간 두었을 경우 원단이 손상될 수 있으니 사용에 주의해 주시기 바랍니다</li>
					</ul>
				</ProductDetail>
			</div>

			{recommendedProducts && recommendedProducts.length > 0 &&
				<div>
					<DetailTitle>추천 상품</DetailTitle>

					<Recommend
						modules={[Navigation, Pagination]}
						slidesPerView={2}
						spaceBetween={20}
						loop={true}
						pagination={{ clickable: true }}
						navigation
						breakpoints={{
							601: {
								slidesPerView:3,
							}
						}}
					>
						{recommendedProducts.map((item) => (
							<SwiperSlide key={item._id}>
								<ul
									onClick={() => {
										handleClose()

										setTimeout(() => {
											productDetails(item._id);
											setModalView("details");
										}, 400);
									}}
								>
									<li className="item-image">
										<img
											key={item.mainImages[0]._id}
											src={`https://yongzin.s3.ap-northeast-2.amazonaws.com/raw/${item.mainImages[0].key}`}
											alt="추천상품 이미지"
										/>	
									</li>
									<li className="item-name">{item.name}</li>
									<li className="item-price">{item.price}</li>
								</ul>
							</SwiperSlide>
						))}
					</Recommend>
				</div>
			}

			<CloseBtn type="button" onClick={() => handleClose()}></CloseBtn>
		</Wrap>
	)
}

export default Details