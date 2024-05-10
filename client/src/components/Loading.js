import React, { useContext, useEffect } from "react";
import styled from "styled-components";
import logo from "./images/logo-reverse.svg";
import { ProductContext } from "../context/ProductContext";

const Logo = styled.div`
	width:300px;
	height:100px;
	background:url(${logo}) no-repeat;
	transition:0.3s;
	position:relative;
	&:before{
		content:"";
		width:100%;
		background-color:red;
		box-shadow:0 0 20px 10px rgba(255,255,255,0.5);
		position:absolute;
		top:0;
		left:0;
		animation:shine 1.5s linear infinite forwards;
	}
	@media ${props => props.theme.mobile} {
		width:240px;
		height:80px;
	}
	@keyframes shine {
		0%{
			top:0;
		}
		50%,100%{
			top:80px;
		}
	}
`
const Wrap = styled.div`
	display:flex;
	justify-content:center;
	align-items:center;
	background-color:#fff;
	position:fixed;
	inset:0;
	z-index:1000;
	&.on{
		transition:0.8s;
		opacity:0;
		transform:scale(10);
		${(Logo)}{
			&:before{
				display:none;
			}
		}
	}
`;

const Loading = () => {
	const {loadingFinish, setLoadingFinish} = useContext(ProductContext);

	useEffect(() => {
		if (loadingFinish) {
			setTimeout(() => {
				setLoadingFinish(false);
			}, 1000);
		}
	}, [loadingFinish, setLoadingFinish])

	return (
		<Wrap className={loadingFinish && "on"}>
			<Logo />
		</Wrap>
	)
}

export default Loading