import React from "react";
import styled from "styled-components";

const Copy = styled.p`
	margin-top:30px;
	font-size:14px;
	font-family:var(--f-light);
`;
const Wrap = styled.footer`
	padding:30px 20px;
	color:#fff;
	background-color:#333;
	p:not(${Copy}){
		font-size:20px;
	}
`;

const Footer = () => {
	return (
		<Wrap>
			<p>포트폴리오 - 박용진</p>
			<Copy>Copyright © 2024 YongZin. All rights reserved.</Copy>
		</Wrap>
	)
}

export default Footer