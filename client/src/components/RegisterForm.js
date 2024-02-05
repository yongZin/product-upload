//회원가입 컴포넌트
import React, { useContext, useState } from "react";
import styled from "styled-components";
import UserInput from "./UserInput";
import { ModalContext } from "../context/ModalContext";

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
	border:1px solid rgba(255, 255, 255, 0.65);
	color:#555;
	background-color:rgba(255, 255, 255, 0.5);
	&:hover{
		border-color:rgba(255, 255, 255, 0.75);
		color:#111;
		background-color:rgba(255, 255, 255, 0.65);
	}
`;
const SubmitBtn = styled.button`
	width:calc(80% - 8px);
	margin-left:8px;
	border:1px solid rgba(0, 198, 4, 0.5);
	color:#fff;
	background-color:rgba(0, 198, 4, 0.5);
	&:hover{
		border-color:rgba(0, 198, 4, 0.6);
		background-color:rgba(0, 198, 4, 0.65);
	}
`;

const RegisterForm = () => {
	const {setModalView, setClose} = useContext(ModalContext);
	const [name, setName] = useState("");
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

	const handleClose = () => {
    setClose(true);

    setTimeout(() => {
      setModalView("off");
      setClose(false);
    }, 300);
  };

	return(
		<Wrap>
			<div>
				<h3>회원가입</h3>

				<form>
					<UserInput
						id="inputName"
						label="이름"
						value={name}
						setValue={setName}
					/>

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
						<SubmitBtn type="submit">회원가입</SubmitBtn>
					</BtnBox>
				</form>
			</div>
		</Wrap>
	)
}

export default RegisterForm