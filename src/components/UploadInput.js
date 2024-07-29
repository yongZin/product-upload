//상품 업로드 인풋 컴포넌트
import React from "react";
import styled from "styled-components";

const InputWrap = styled.ul`
  width:100%;
	display:flex;
	align-items:center;
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
					border-bottom-color:rgba(0, 0, 0, 0.4);
				}
			}
		}
		> input{
			width:100%;
			padding:8px 0;
			font-size:14px;
			border:0;
			border-bottom:1px solid rgba(0, 0, 0, 0.1);
			background-color:transparent;
			transition:0.2s;
			&::placeholder{
				font-style:italic;
			}
			&:focus{
				border-bottom-color:rgba(0, 0, 0, 0.4);
			}
		}
	}
	@media ${props => props.theme.tablet} {
		border-color:#bbb;
		li{
			&:last-child{
				border-left-color:#bbb;
			}
		}
	}
	@media ${props => props.theme.mobile} {
		li{
			font-size:13px;
			>input{
				font-size:13px;
			}
		}
	}
	@media ${props => props.theme.mobile_xs} {
		li{
			padding:18px 12px;
			font-size:12px;
			>input{
				font-size:12px;
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
		display:none;
		&:checked{
			& + label{
				padding:0;
				&:before{
					width:6px;
					height:11px;
					opacity:1;
				}
			}
		}
		&#black,
		&#purple,
		&#blue,
		&#red{
			& + label{
				&:before{
					border-right-color:#fff;
					border-bottom-color:#fff;
				}
			}
		}
	}
	label{
		width:30px;
		height:30px;
		display:block;
		padding:5px;
		font-size:0;
		border-radius:50%;
		background-color:#aaa;
		box-sizing:border-box;
		transition:0.3s;
		position:relative;
		cursor:pointer;
		&:before{
			content:"";
			width:4px;
			height:8px;
			border-right:2px solid #111;
			border-bottom:2px solid #111;
			position:absolute;
			top:48%;
			left:50%;
			transform:translate(-50%,-50%) rotate(45deg);
			transition:0.3s;
			opacity:0;
		}
		span{
			width:100%;
			height:100%;
			display:block;
			border-radius:50%;
			transition:0.3s;
		}
		&:hover{
			&:before{
				opacity:0.5;
			}
		}
	}
	@media ${props => props.theme.tablet} {
		margin:0 8px 10px 0;
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