//로그인, 회원가입 인풋 컴포넌트
import React from "react";
import styled from "styled-components";

const InputWrap = styled.div`
	display:flex;
	align-items:center;
	margin-bottom:20px;
	padding:10px 20px;
	border-radius:6px;
	border:1px solid #ccc;
	background-color:rgba(255, 255, 255, 0.5);
	position:relative;
	&:before{
		content:"";
		width:calc(20% - 12px);
		height:16px;
		display:inline-block;
		margin-right:12px;
		border-right:1px solid rgba(0, 0, 0, 0.3);
	}
	input{
		width:calc(80% - 8px);
		margin-left:8px;
		padding:8px 0;
		font-size:14px;
		border:0;
		background-color:transparent;
		&#inpuChk{
			& + label{
				font-size:0.93em;
				letter-spacing:-1px;
			}
		}
	}
	label{
		width:20%;
		height:100%;
		display:flex;
		align-items:center;
		padding-left:16px;
		font-size:16px;
		color:#555;
		position:absolute;
		top:1px;
		left:0;
	}
	@media ${props => props.theme.mobile} {
		&:before{
			width:70px;
			margin:0;
		}
		input{
			width:calc(100% - 70px);
			&#inpuChk{
			& + label{
				font-size:13px;
				letter-spacing:-1.1px;
			}
		}
		}
		label{
			width:86px;
			font-size:14px;
		}
	}
`;

const UserInput = ({ id, label, value, setValue, type = "text" }) => {
	return(
		<InputWrap>
			<input
				autoComplete="off"
				id={id}
				type={type}
				value={value}
				onChange={(e) => setValue(e.target.value)}
			/>
			<label htmlFor={id}>{label}</label>
		</InputWrap>
	)
}

export default UserInput