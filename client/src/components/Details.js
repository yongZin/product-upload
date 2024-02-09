import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { toast } from "react-toastify";
import { AuthContext } from "../context/AuthContext"
import { ProductContext } from "../context/ProductContext";
import { ModalContext } from "../context/ModalContext";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { TbTrash, TbTrashX } from "react-icons/tb";
const ADMIN_ID = process.env.REACT_APP_ADMIN_ID; //관리자 확인용
const GUEST_ID = process.env.REACT_APP_GUEST_ID; //게스트 확인용

const Wrap = styled.div`
	height:100%;
	overflow:auto;
	img{
		width:30%;
	}
`;
const LikeBth = styled.button`
	font-size:20px;
	svg{
		display:inline-block;
		vertical-align:top;
		transition:0.2s;
	}
	&:hover{
		svg{
			color:red;
		}
	}
`;
const DeleteBtn = styled.button`
	font-size:20px;
	position:relative;
	svg{
		transition:0.2s;
		&:last-child{
			position:absolute;
			inset:0;
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
	&.disabled{ //임시관리자(게스트)는 관리자가 업로드한 상품 삭제 불가
		background-color:red;
	}
`;

const Details = () => {
	const {userInfo} = useContext(AuthContext);
	const {
		products, setProducts,
		selectedProduct
	} = useContext(ProductContext);
	const {setModalView,setClose} = useContext(ModalContext);
	const [hasLiked, setHasLiked] = useState(false);
	const productId = selectedProduct._id;

	useEffect(() => { //좋아요 유무 확인
		if (
			userInfo
			&& selectedProduct
			&& selectedProduct.likes.includes(userInfo.userID)
			) {
				setHasLiked(true);
		}

	}, [userInfo, selectedProduct]);

	const likeHandler = async () => {
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

	const deleteHandler = async () => {
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

	const handleClose = () => {
    setClose(true);

    setTimeout(() => {
      setModalView("off");
      setClose(false);
    }, 300);
  };

	const mainImages = selectedProduct.mainImages.map((image) => {
		return(
			<img
				key={image.key}
				src={`http://localhost:4000/uploads/${image.filename}`}
				alt="상품 대표 이미지"
			/>
		)
	});

	return (
		<Wrap>
			{userInfo &&
				((userInfo.userID) === ADMIN_ID || 
        (userInfo.userID) === GUEST_ID) &&

				<DeleteBtn
					onClick={deleteHandler}
					className={
						userInfo.userID === GUEST_ID
						&& selectedProduct.user._id === ADMIN_ID
						? "disabled" : ""
					}
				>
					<TbTrash />
					<TbTrashX />
				</DeleteBtn>

			}

			<LikeBth onClick={likeHandler}>
				{hasLiked
					? <AiFillHeart style={{color: "red"}} />
					: <AiOutlineHeart />
				}
				{selectedProduct.likes.length}
			</LikeBth>

			<div>{mainImages}</div>
			<p>{selectedProduct.name}</p>
			<p>{selectedProduct.price}</p>
			<div>{selectedProduct.detail}</div>
			<div>
        {selectedProduct.details.map((content, index) => (
          <div key={index} dangerouslySetInnerHTML={{ __html: content }} />
        ))}
      </div>
			<p>{selectedProduct.type}</p>
			<p>{selectedProduct.material}</p>
			<p>{selectedProduct.color}</p>
		</Wrap>
	)
}

export default Details