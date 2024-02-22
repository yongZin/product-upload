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
const TopImages = styled.div`
	width:45%;
	display:inline-block;
	vertical-align:top;
	img{
		width:100%;
		&:last-child{
			display:none;
		}
	}
`;
const TopInfo = styled.div`
	width:55%;
	display:inline-block;
	vertical-align:top;
	padding-left:20px;
	font-size:0;
`;
const ProductInfo = styled.div`
	padding:30px 0;
	font-size:0;
	border-radius:4px;
	background-color:rgba(0,0,0,0.1);
	>div{
		width:75%;
		max-width:500px;
		margin:0 auto;
		p{
			line-height:1.4;
			font-size:16px;
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
`;
const ProductInfoTitle = styled.p`
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
`;
const ProductDetail = styled.div`
	margin-top:40px;
	border-radius:4px;
	background-color:rgba(0,0,0,0.1);
	ul{
		width:100%;
		display:flex;
		border-bottom:1px solid #ccc;
		li{
			width:25%;
			padding:18px 20px;
			font-size:14px;
			color:#414141;
			&:last-child{
				width:75%;
				border-left:1px solid #ccc;
			}
		}
		&:last-child{
			border-bottom:0;
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
`;
// const ScrollTopBtn = styled.button`
// 	display:block;
// 	padding:10px;
// 	border-radius:50%;
// 	background-color:rgba(0,0,0,0.2);
// 	position:absolute;
// 	bottom:80px;
// 	right:60px;
// 	transition:0.3s;
// 	&:before{
// 		content:"";
// 		width:6px;
// 		height:6px;
// 		display:block;
// 		border-top:2px solid #fff;
// 		border-left:2px solid #fff;
// 		transform:translateY(2px) rotate(45deg);
// 	}
// 	&:hover{
// 		background-color:rgba(0,0,0,0.15);
// 	}
// `;
const CloseBtn = styled.button`
	width:30px;
	height:30px;
	border-radius:50%;
	background-color:rgba(0,0,0,0.07);
	position:absolute;
	bottom:15px;
	left:50%;
	transform:translateX(-50%);
	transition:0.3s;
	&:before,&:after{
		content:"";
		width:12px;
		height:2px;
		border:0;
		background-color:#fff;
		position:absolute;
		top:14px;
		left:9px;
		transform:rotate(45deg);
	}
	&:after{
		transform:rotate(-45deg);
	}
	&:hover{
 		background-color:rgba(0,0,0,0.15);
 	}
`;


const Details = () => {
	const {userInfo} = useContext(AuthContext);
	const {
		products, setProducts,
		selectedProduct
	} = useContext(ProductContext);
	const {setModalView,setClose} = useContext(ModalContext);
	const [product, setProduct] = useState();
	const [hasLiked, setHasLiked] = useState(false);
	const [error, setError] = useState(false);
	const wrapRef = useRef();
	const productId = selectedProduct._id;
	
	useEffect(() => { //선택한 상품 정보 DB에서 찾아오기
		const item = products.find((item) => item._id === productId);
		
		if (item) {
			setProduct(item);
			setError(false);
		} else {
			setError(true);
		}
	}, [products, productId, setProduct, product]);

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

			const result = await axios.delete(`/upload/${productId}`);

			handleClose();
			toast.success(result.data.message);
			setProducts(products.filter(product => product._id !== productId)); //삭제후 바로 리스트에서 제거
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

	const handleClose = () => { //모달 닫기 이벤트
    setClose(true);

    setTimeout(() => {
      setModalView("off");
      setClose(false);
    }, 300);
  };

	// const scrollTopHandler = () => {
	// 	if (wrapRef.current) {
	// 		wrapRef.current.scrollTo({
	// 			top:0,
	// 			behavior: "smooth"
	// 		});
	// 	}
	// };

	const mainImages = selectedProduct.mainImages.map((image) => {
		return(
			<img
				key={image.key}
				src={`https://yongzin.s3.ap-northeast-2.amazonaws.com/raw/${image.filename}`}
				alt="상품 대표 이미지"
			/>
		)
	});

	return (
		<Wrap
			ref={wrapRef}
			className={
				(userInfo && (userInfo.userID === GUEST_ID || userInfo.userID === ADMIN_ID))
					? (selectedProduct.user._id === ADMIN_ID
						? (userInfo.userID === GUEST_ID)
							? "admin disabled" // 임시관리자(게스트)는 관리자가 업로드한 상품 삭제 불가
							: "admin" // 관리자, 임시관리자 로그인 시
						: "")
					: ""
			}
		>
			<div>
				<TopImages>{mainImages}</TopImages>

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

				<ProductInfoTitle>상품 정보</ProductInfoTitle>

				<ProductInfo>
					{product.details.map((content, index) => (
						<div key={index} dangerouslySetInnerHTML={{ __html: content }} />
					))}
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
						<li>크기</li>
						<li>310 x 370 x 120 mm</li>
					</ul>
				</ProductDetail>
			</div>

			{/* <ScrollTopBtn
				type="button"
				onClick={scrollTopHandler}
			></ScrollTopBtn> */}

			<CloseBtn type="button"></CloseBtn>
		</Wrap>
	)
}

export default Details