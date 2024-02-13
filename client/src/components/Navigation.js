//상단 헤더 컴포넌트(내비게이션)
import React, { useContext } from "react";
import styled from "styled-components";
import logo from "./images/logo.svg";
import { Link } from "react-router-dom";
import axios from "axios";
import { ModalContext } from "../context/ModalContext";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";

const Wrap = styled.div`
	width:100%;
	background-image: linear-gradient(to bottom, #ffffff, transparent);
	backdrop-filter:blur(2px);
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
				font-family:var(--f-ebold);
				color:#414141;
				cursor:pointer;
				&:hover{
					text-decoration:underline;
				}
			}
		}
	}
	/* @media ${props => props.theme.tablet} {
		padding:15px 20px;
  }
	@media ${props => props.theme.mobile_xs} {
		a, span{
			font-size:14px;
			text-align:center;
			.user{
				display:block;
				font-size:13px;
			}
		}
  } */
`;

const Navigation = () => {
	const {setModalView} = useContext(ModalContext);
	const {userInfo, setUserInfo} = useContext(AuthContext);

	const logoutHandler = async () => {
		try {
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