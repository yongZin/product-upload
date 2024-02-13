//상품 업로드 인풋 컴포넌트
import React from "react";
import styled from "styled-components";

const InputWrap = styled.ul`
  width:100%;
	display:flex;
	border-radius:15px;
	border:1px solid #ccc;
	background-color:rgba(255, 255, 255, 0.5);
	& + ul{
		margin-top:8px;
	}
	li{
		width:25%;
		padding:18px 20px;
		font-size:14px;
		&:last-child{
			width:75%;
			padding:10px 20px;
			border-left:1px solid #ccc;
			&:hover{
				input{
					border-bottom-color:rgba(0, 0, 0, 0.7);
				}
			}
		}
		input{
			width:50%;
			min-width:250px;
			padding:8px 0;
			font-size:14px;
			border:0;
			border-bottom:2px solid rgba(0, 0, 0, 0.2);
			background-color:transparent;
			transition:0.2s;
			&::placeholder{
				font-style:italic;
			}
			&:focus{
				border-bottom-color:rgba(0, 0, 0, 0.7);
			}
		}
	}
`;

const UploadInput = ({ label, placeholder, value, onChange }) => {
	return (
		<InputWrap>
			<li>{label}</li>
			<li>
				<input
					autoComplete="off"
					type="text"
					placeholder={placeholder}
					value={value}
					onChange={onChange}
				/>
			</li>
		</InputWrap>
	)
}

export default UploadInput