//상단 헤더 컴포넌트(내비게이션)
import React, { useContext, useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import logo from "./images/logo.svg";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { ModalContext } from "../context/ModalContext";
import { AuthContext } from "../context/AuthContext";
import { ProductContext } from "../context/ProductContext";
const GUEST_ID = process.env.REACT_APP_GUEST_ID; //게스트 확인용

const Wrap = styled.div`
	width:100%;
	background-image:linear-gradient(to bottom, #000000, transparent);
	position:fixed;
	top:0;
	left:0;
	z-index:100;
	transition:0.1s;
	background-color:transparent;
`;
const Content = styled.div`
	width:100%;
	max-width:1000px;
	display:flex;
	align-items:center;
	justify-content:space-between;
	margin:0 auto;
	padding:15px 30px;
	.nav{
		&-logo{
			width:102px;
			height:34px;
			font-size:0 ;
			background:url(${logo}) no-repeat;
			background-size:cover;
		}
		&-btnBox{
			li{
				font-size:16px;
				text-shadow:1px 1px 0 rgba(0,0,0,0.5);
				color:#ededed;
				cursor:pointer;
				&:hover{
					text-decoration:underline;
				}
			}
		}
	}
	@media ${props => props.theme.tablet} {
		padding:15px 20px;
  }
	@media ${props => props.theme.mobile} {
		padding:15px 10px;
		.nav{
			&-btnBox{
				li{
					font-size:14px;
				}
			}
		}
  }
	@media ${props => props.theme.mobile_xs} {
		.nav{
			&-logo{
				width:85px;
				height:28px;
			}
		}
  }
`;

const Navigation = () => {
	const {setModalView} = useContext(ModalContext);
	const {userInfo, setUserInfo} = useContext(AuthContext);
	const {
		products, setProducts,
		productsAll, setProductsAll
	} = useContext(ProductContext);
	const [guestProducts, setGuestProducts] = useState([]);

	const deleteGuestProducts = useCallback(async () => {
		for (const item of guestProducts) {
			await axios.delete(`/upload/${item._id}`);
		}
	
		setProducts(products.filter((product) => {
			return !guestProducts.find((item) => item._id === product._id);
		}));

		setProductsAll(productsAll.filter((product) => {
			return !guestProducts.find((item) => item._id === product._id);
		}));
	}, [guestProducts, products, setProducts, productsAll, setProductsAll]);

	const preventClose = useCallback(async (e) => {
    e.preventDefault();
    e.returnValue = ""; //Chrome에서 동작하도록;

		deleteGuestProducts()
  }, [deleteGuestProducts]);
  
  useEffect(() => {
    if(userInfo && (userInfo.userID === GUEST_ID)) {
      (() => {
        window.addEventListener("beforeunload", preventClose);
      })();

      return () => {
        window.removeEventListener("beforeunload", preventClose);
      };
    }
  }, [userInfo, preventClose]);

	useEffect(() => {
		setTimeout(() => {
			if (userInfo && userInfo.userID === GUEST_ID) {
				axios
					.get("/users/userInfo/products")
					.then((result) => {
						setGuestProducts(result.data);
						// setConfirm(true);
					})
					.catch((error) => {
						toast.error(error.response.data.message)
						console.error(error);
					})
			} else{
				setGuestProducts([]);
			}
		}, 100);
	}, [userInfo, products]);

	const logoutHandler = async () => {
		try {
			await deleteGuestProducts();
			await axios.patch("/users/logout");
			setUserInfo();

			toast.success("로그아웃");
		} catch (error) {
			console.error(error);
			toast.error(error.message);
		}
	};

	return (
		<Wrap>
				<Content>
					<Link className="nav-logo" to="/">홈</Link>

					<ul className="nav-btnBox">
						{
							userInfo ? <li onClick={logoutHandler}>로그아웃({userInfo.name})</li>
							: <li onClick={() => setModalView("login")}>로그인</li>
						}
					</ul>
				</Content>
			</Wrap>
	)
}

export default Navigation