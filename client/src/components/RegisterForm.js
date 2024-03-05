//회원가입 컴포넌트
import React, { useContext, useState } from "react";
import styled from "styled-components";
import UserInput from "./UserInput";
import { ModalContext } from "../context/ModalContext";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";
import axios from "axios";

const Wrap = styled.div`
	width:100%;
	margin:0 auto;
	h3{
		margin-bottom:40px;
		text-align:center;
		font-size:30px;
	}
	@media ${props => props.theme.mobile} {
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
	border:1px solid rgba(0, 198, 4, 0.5);
	color:#fff;
	background-color:rgba(0, 198, 4, 0.5);
	&:hover{
		border-color:rgba(0, 198, 4, 0.6);
		background-color:rgba(0, 198, 4, 0.65);
	}
	@media ${props => props.theme.mobile} {
		width:calc(100% - 93px);	
	}
`;

const RegisterForm = () => {
	const {setModalView, setClose} = useContext(ModalContext);
	const {setUserInfo} = useContext(AuthContext);
	const [name, setName] = useState("");
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [passwordCheck, setPasswordCheck] = useState("");

	const onSubmit = async (e) => {
		try {
			e.preventDefault();
			
			if(username.length < 3)
				throw new Error("아이디를 3글자 이상으로 해주세요.");
			if(password.length < 6)
				throw new Error("비밀번호를 6글자 이상으로 해주세요.");
			if(password !== passwordCheck)
				throw new Error("비밀번호를 확인해주세요.");

			const result = await axios.post("/users/register", {
				name,
				username,
				password
			});

			setUserInfo({ //유저정보 저장
				userID: result.data.userID,
				sessionId: result.data.sessionId,
				name: result.data.name,
			});

			toast.success("회원가입 완료");
			handleClose();
		} catch (error) {
			console.error(error);
			toast.error(error.message);
		}
	}

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

				<form onSubmit={onSubmit}>
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
					<UserInput
						id="inpuChk"
						label="비밀번호 확인"
						value={passwordCheck}
						setValue={setPasswordCheck}
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