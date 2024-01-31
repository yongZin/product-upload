import React, { useState } from "react";
import styled from "styled-components";
import UserInput from "./UserInput";

const Wrap = styled.div`
	width:100%;
	margin:0 auto;
	h3{
		margin-bottom:40px;
		text-align:center;
		font-size:30px;
	}
	@media ${props => props.theme.tablet} {
		padding:0 20px;
	}
`;
const SubmitBtn = styled.button`
	width:100%;
	height:48px;
	margin-top:10px;
	font-size:16px;
	border:0;
	border-radius:6px;
	color:#fff;
	background-color:#333;
	transition:0.3s;
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
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

	const loginHandler = async (e) => {
		e.preventDefault();
	};

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

					<SubmitBtn type="submit">로그인</SubmitBtn>
				</form>

				<FootBth>
					<li>
						<button type="button">회원가입</button>
					</li>
					<li>
						<button type="button">관리자 로그인</button>
					</li>
				</FootBth>
			</div>
		</Wrap>
	)
}

export default LoginForm