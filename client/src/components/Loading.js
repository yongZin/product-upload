import React from "react";
import styled from "styled-components";

const Wrap = styled.div`
	display:flex;
	justify-content:center;
	align-items:center;
	background-color:#fff;
	position:fixed;
	inset:0;
	z-index:1000;
`;
const Logo = styled.div`
	width:50px;
	height:36px;
	display:flex;
	animation:bound 0.4s alternate infinite ease;
	&:before{
		content:"";
		width:46%;
		height:100%;
		display:block;
		background-color:#000;
	}
	&:after{
		content:"";
		width:54%;
		height:75%;
		display:block;
		border-top:12px solid #000;
		border-bottom:11px solid #000;
		background-color:transparent;
		box-sizing:border-box;
	}
	@keyframes bound {
		0%{
			width:90px;
			height:32px;
			transform:translateY(40px);
		}
		25%{
			width:50px;
			height:36px;
		}
		100%{
			transform:translateY(0);
		}
	}
`;
const Shadow = styled.div`
	width:50px;
	height:4px;
	display:block;
	margin:28px auto 0;
	box-shadow:0px 12px 7px 0 #000;
	transform-origin:50%;
	animation:shadow 0.4s alternate infinite ease;
	@keyframes shadow {
		0%{
			width:90px;
		}
		25%{
			width:50px;
			opacity:0.7;
		}
		100%{
			width:10px;
			opacity:0.4;
		}
	}
`;

const Loading = () => {
	return (
		<Wrap>
			<div>
				<Logo />
				<Shadow />
			</div>
		</Wrap>
	)
}

export default Loading