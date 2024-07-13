//로그인 컴포넌트
import React, { useContext } from "react";
import styled from "styled-components";
import UserInput from "./UserInput";
import { ModalContext } from "../context/ModalContext";
import { AuthContext } from "../context/AuthContext";
const GUEST_ID = process.env.REACT_APP_GUEST_LOGIN_ID; //임시관리자 ID
const GUEST_PWD = process.env.REACT_APP_GUEST_LOGIN_PWD; //임시관리자 Password

const Wrap = styled.div`
	width:100%;
	margin:0 auto;
	>div{
		&:after{
			content:"⚠️ 관리자 로그인을 통해 상품 업로드 권한을 부여 받아보세요!";
			display:block;
			margin-top:15px;
			font-size:13px;
			text-align:center;
			color:#666;
			word-break:keep-all;
		}
	}
	h3{
		margin-bottom:40px;
		text-align:center;
		font-size:30px;
	}
	@media ${props => props.theme.tablet} {
		>div{
			&:after{
				color:#777;
			}
		}
	}
	@media ${props => props.theme.mobile} {
		>div{
			&:after{
				font-size:12px;
			}
		}
		h3{
			font-size:25px;
		}
	}
	@media ${props => props.theme.mobile_xs} {
		h3{
			font-size:20px;
		}
	}
`;
const BtnBox = styled.div`
	padding-top:10px;
	font-size:0;
	button{
		display:inline-block;
		vertical-align:middle;
		padding:14px 0;
		font-size:16px;
		border-radius:6px;
		transition:0.2s;
	}
	@media ${props => props.theme.mobile} {
		button{
			font-size:14px;
		}
	}
`;
const CloseBtn = styled.button`
	width:20%;
	border:1px solid #ccc;
	color:#555;
	background-color:rgba(255, 255, 255, 0.5);
	&:hover{
		border-color:#bbb;
		color:#111;
		background-color:rgba(255, 255, 255, 0.65);
	}
	@media ${props => props.theme.mobile} {
		width:85px;	
	}
`;
const SubmitBtn = styled.button`
	width:calc(80% - 8px);
	margin-left:8px;
	border:1px solid #555;
	color:#fff;
	background-color:#333;
	&.loading{
		position:relative;
		color:transparent;
		pointer-events:none;
		&:before{
			content:"";
			width:25px;
			height:25px;
			border-radius:50%;
			border:5px solid #eee;
			border-bottom-color:#aaa;
			animation:rotation 0.6s linear infinite;
			position:absolute;
			top:calc(50% - 13px);
			left:calc(50% - 13px);
			box-sizing:border-box;
		}
		@keyframes rotation {
			0%{
				transform:rotate(0deg);
			}
			100%{
				transform:rotate(360deg);
			}
		}
	}
	&:hover{
		background-color:#555;
	}
	@media ${props => props.theme.mobile} {
		width:calc(100% - 93px);	
	}
`;
const FootBth = styled.ul`
	width:100%;
	margin-top:40px;
	display:flex;
	justify-content:center;
	align-items:center;
	text-align:center;
	position:relative;
	&:before{
		content:"";
		width:2px;
		height:12px;
		background-color:rgba(119,119,119, 0.5);
		position:absolute;
		top:calc(50% - 6px);
		left:calc(50% - 1px);
	}
	li{
		width:50%;
		text-align:left;
		&:first-child{
			text-align:right;
			button{
				padding-top:5px;
			}
		}
	}
	button{
		margin:0 10px;
		padding:4px 8px;
		font-size:14px;
		color:#555;
		transition:0.2s;
		&:hover{
			color:#222;
		}
	}
	@media ${props => props.theme.tablet} {
		button{
			color:#484848;
		}
	}
	@media ${props => props.theme.mobile} {
		margin-top:30px;
		button{
			font-size:13px;
		}
	}
`;

const LoginForm = () => {
	const {
		setModalView,
		setClose,
		handleClose
	} = useContext(ModalContext);
	const {
		username, setUsername,
		password, setPassword,
		loginLoad,
		loginHandler
	} = useContext(AuthContext);

	const guestHandler = () => {
		setUsername(GUEST_ID);
		setPassword(GUEST_PWD);
	}

	return(
		<Wrap>
			<div>
				<h3>로그인</h3>

				<form onSubmit={loginHandler}>
					<UserInput
						id="inputId"
						label="아이디"
						value={username}
						setValue={setUsername}
					/>
					<UserInput
						id="inputPwd"
						label="비밀번호"
						value={password}
						setValue={setPassword}
						type="password"
					/>

					<BtnBox>
						<CloseBtn type="button" onClick={handleClose}>닫기</CloseBtn>
						<SubmitBtn type="submit" className={loginLoad && "loading"}>로그인</SubmitBtn>
					</BtnBox>

					<FootBth>
						<li>
							<button
								type="button"
								onClick={() => {
									setClose(true);

									setTimeout(() => {
										setModalView("register");
										setClose(false);
									}, 300);
								}}
							>
								회원가입
							</button>
						</li>
						<li>
							<button type="submit" onClick={guestHandler}>관리자 로그인</button>
						</li>
					</FootBth>
				</form>
			</div>
		</Wrap>
	)
}

export default LoginForm;