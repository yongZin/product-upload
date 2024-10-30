//상단 헤더 컴포넌트(내비게이션)
import React, { useContext, useEffect, useCallback } from "react";
import styled from "styled-components";
import logo from "./images/logo.svg";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { ModalContext } from "../context/ModalContext";
import { AuthContext } from "../context/AuthContext";
import { useGuestProducts, useDeleteGuestProducts } from "../hooks/useAuth";
const GUEST_ID = process.env.REACT_APP_GUEST_ID; //게스트 확인용

const Wrap = styled.header`
	width:100%;
	background-image:linear-gradient(to bottom, #000000, transparent);
	position:fixed;
	top:0;
	left:0;
	z-index:100;
	transition:0.1s;
	background-color:transparent;
`;
const Content = styled.nav`
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
	const {userInfo, logoutHandler} = useContext(AuthContext);

	const { data: guestProducts = [] } = useGuestProducts();
	const deleteGuestProducts = useDeleteGuestProducts();

	const HandleLogout = useCallback(async () => {
		try {
			if (guestProducts.length > 0) {
        await deleteGuestProducts.mutateAsync(guestProducts);
      }

			logoutHandler();
		} catch (error) {
			console.error(error);
			toast.error(error.message);
		}
	}, [guestProducts, deleteGuestProducts, logoutHandler]);
  
  useEffect(() => { //임시관리자 상품 삭제
		const preventClose = (e) => { //pc전용 (beforeunload)
			e.preventDefault();
			e.returnValue = ""; //Chrome에서 동작하도록;
	
			if (guestProducts.length > 0) {
        deleteGuestProducts.mutate(guestProducts);
      }
		};

		const mobilePreventClose = () => { //mobile전용 (visibilitychange)
			if (document.visibilityState === "hidden" && guestProducts.length > 0) {
        deleteGuestProducts.mutate(guestProducts);
      }
		}

    if(userInfo?.userID === GUEST_ID) {
			if ("ontouchstart" in window) { //터치 이벤트인 경우(터치가 가능한 노트북 포함)
				window.addEventListener("visibilitychange", mobilePreventClose);
			} else {
				window.addEventListener("beforeunload", preventClose);
			}

      return () => {
				if ("ontouchstart" in window) { //터치 이벤트인 경우(터치가 가능한 노트북 포함)
					window.removeEventListener("visibilitychange", mobilePreventClose);
				} else {
					window.removeEventListener("beforeunload", preventClose);
				}
      };
    }
  }, [userInfo, guestProducts, deleteGuestProducts]);

	useEffect(() => {
		const checkSessionExpire = setInterval(() => {
			if (
				userInfo && userInfo.expiresAt &&
				new Date(userInfo.expiresAt) < new Date()
			) {
				logoutHandler()
			}
		}, 60000);

		return () => clearInterval(checkSessionExpire);
	}, [userInfo, logoutHandler])

	return (
		<Wrap>
			<Content>
				<Link className="nav-logo" to="/">홈</Link>

				<ul className="nav-btnBox">
					{
						userInfo ? <li onClick={HandleLogout}>로그아웃({userInfo.name})</li>
						: <li onClick={() => setModalView("login")}>로그인</li>
					}
				</ul>
			</Content>
		</Wrap>
	)
}

export default Navigation