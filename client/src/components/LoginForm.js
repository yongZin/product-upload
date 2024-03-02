//로그인 컴포넌트
import React, { useContext, useState } from "react";
import styled from "styled-components";
import UserInput from "./UserInput";
import { ModalContext } from "../context/ModalContext";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";
import axios from "axios";
const GUEST_ID = process.env.REACT_APP_GUEST_LOGIN_ID; //임시관리자 ID
const GUEST_PWD = process.env.REACT_APP_GUEST_LOGIN_PWD; //임시관리자 Password

const Wrap = styled.div`
	width:100%;
	margin:0 auto;
	h3{
		margin-bottom:40px;
		text-align:center;
		font-size:30px;
	}
	/* @media ${props => props.theme.tablet} {
		padding:0 20px;
	} */
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
`;
const SubmitBtn = styled.button`
	width:calc(80% - 8px);
	margin-left:8px;
	border:1px solid #555;
	color:#fff;
	background-color:#333;
	&:hover{
		background-color:#555;
	}
`;
const FootBth = styled.ul`
	width:100%;
	margin-top:50px;
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
		color:#777;
		transition:0.2s;
		&:hover{
			color:#444;
		}
	}
`;

const LoginForm = () => {
	const {
		setModalView,
		setClose,
		handleClose
	} = useContext(ModalContext);
	const {setUserInfo} = useContext(AuthContext);
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

	const loginHandler = async (e) => {
		try {
			e.preventDefault();

			if(username.length < 3 || password.length < 6)
				throw new Error("입력하신 정보가 올바르지 않습니다.");

			const result = await axios.patch(
				"/users/login",
				{ username, password }
			);

			setUserInfo({
				userID: result.data.userID,
				sessionId: result.data.sessionId,
				name: result.data.name,
			});
			
			handleClose();
			toast.success("로그인 성공");
		} catch (error) {
			console.error(error.response);
			toast.error(error.response.data.message);
		}
	};

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
						<SubmitBtn type="submit">로그인</SubmitBtn>
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
							<button
								type="submit"
								onClick={guestHandler}
							>
								관리자 로그인
							</button>
						</li>
					</FootBth>
				</form>
			</div>
		</Wrap>
	)
}

export default LoginForm;