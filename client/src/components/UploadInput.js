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
			font-size:0;
			border-left:1px solid #ccc;
			&:hover{
				input{
					border-bottom-color:rgba(0, 0, 0, 0.7);
				}
			}
		}
		> input{
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
const ColorRadio = styled.div`
	display:inline-block;
	vertical-align:middle;
	margin:0 4px 4px 0;
	position:relative;
	input{
		/* display:none; */
		width:1px;
		height:1px;
		margin:-1px;
		overflow:hidden;
		position:absolute;
		clip:rect(0 0 0 0);
		clip-path:polygon(0 0, 0 0, 0 0);
		&:checked{
			& + label{
				background-color:#aaa;
				&:before{
					content:"";
					width:5px;
					height:8px;
					border-right:2px solid #111;
					border-bottom:2px solid #111;
					position:absolute;
					top:49%;
					left:50%;
					transform:translate(-50%,-50%) rotate(45deg);
				}
			}
		}
		&#black,
		&#purple,
		&#blue,
		&#red{
			&:checked{
				& + label{
					&:before{
						border-right:2px solid #fff;
						border-bottom:2px solid #fff;
					}
				}
			}
		}
	}
	label{
		display:block;
		padding:4px;
		font-size:0;
		border-radius:50%;
		border:1px solid #bbb;
		background-color:#ccc;
		box-sizing:border-box;
		transition:0.3s;
		position:relative;
		cursor:pointer;
		span{
			width:20px;
			height:20px;
			display:block;
			border-radius:50%;
			line-height:20px;
		}
		&:hover{
			background-color:#aaa;
			border:1px solid #bbb;
		}
	}
`;

const UploadInput = ({
	label,
	placeholder,
	type,
	value,
	onChange,
	colorOptions = []
}) => {

	const colorRadios = colorOptions.map((color, index) => (
		<ColorRadio key={index}>
			<input
				id={color}
				type="radio"
				name="radio"
				value={color}
				checked={value === color}
				onChange={onChange}
			/>
			<label htmlFor={color}>
				<span
					style={
						color === "etc"
							? { background: "linear-gradient(to right, red 0%, orange 12%, yellow 24%, green 48%, blue 70%, violet 85%)" }
							: { background: color }
					}
				></span>
			</label>
		</ColorRadio>
	));

	return (
		<InputWrap>
			<li>{label}</li>
			<li>
        {type === "text" ? (
          <input
            autoComplete="off"
            type="text"
            placeholder={placeholder}
            value={value}
            onChange={onChange}
          />
        ) : type === "radio" && colorOptions ? (
          <>
            {colorRadios}
          </>
        ) : null}
      </li>
		</InputWrap>
	)
}

export default UploadInput