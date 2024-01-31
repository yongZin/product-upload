import React, { useContext } from "react";
import styled from "styled-components";
import logo from "./images/logo.svg";
import { ModalContext } from "../context/ModalContext";

const Wrap = styled.div`
	width:100%;
	/* background-color:rgba(0,29,58,.18); */
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
	a{
		width:102px;
		height:34px;
		font-size:0 ;
		background:url(${logo}) no-repeat;
		background-size:cover;
	}
	ul{
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

	return (
		<Wrap>
				<Content>
					<a href="/">홈</a>

					<ul>
						<li onClick={() => setModalView(2)}>로그인</li>
						{/* <li>로그아웃</li> */}
					</ul>
				</Content>
			</Wrap>
	)
}

export default Navigation