//메인 페이지 컴포넌트
import React, { useState, useContext, useEffect } from "react";
import styled from "styled-components";
import Modal from "../components/Modal";
import UploadForm from "../components/UploadForm";
import ProductList from "../components/ProductList";
import LoginForm from "../components/LoginForm";
import RegisterForm from "../components/RegisterForm";
import Details from "../components/Details";
import { ModalContext } from "../context/ModalContext";
import freitagBG from "../components/images/truck.jpg";

const BrandInfo = styled.section`
	width:100%;
	height:500px;
	background:url(${freitagBG}) no-repeat;
	background-position:center;
	background-size:cover;
	position:relative;
	z-index:10;
	transition:0.3s;
	&:after{
		content:"";
		position:absolute;
		inset:0;
		background-color:rgba(255,255,255,0.1);
	}
	@media ${props => props.theme.tablet} {
		height:350px;
	}
	@media ${props => props.theme.mobile} {
		height:250px;
	}
	@media ${props => props.theme.mobile_xs} {
		height:180px;
	}
`;
const ScrollTopBtn = styled.div`
	width:100%;
	max-width:1200px;
	position:fixed;
	bottom:0;
	left:50%;
	transform:translateX(-50%);
	button{
		width:32px;
		height:32px;
		border-radius:50%;
		border:1px solid rgba(255,255,255,0.3);
		background-color:#111;
		position:absolute;
		bottom:-30px;
		right:10px;
		opacity:0.2;
		transition:0.2s;
		&:before{
			content:"";
			width:30%;
			height:30%;
			border-top:2px solid #fff;
			border-right:2px solid #fff;
			position:absolute;
			top:60%;
			left:50%;
			transform:translate(-50%, -50%) rotate(-45deg);
		}
		&.on{
			bottom:20px;
		}
		&:hover{
			opacity:1;
		}
	}
`;

const MainPage = () => {
	const {modalView} = useContext(ModalContext);
	const [showButton, setShowButton] = useState(false);

	const handleScroll = () => {
    if (window.scrollY > 100) {
      setShowButton(true);
    } else {
      setShowButton(false);
    }
  };

	useEffect(() => {
		window.addEventListener('scroll', handleScroll);

		return () => {
      window.removeEventListener('scroll', handleScroll);
    };
	}, []);

	const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth' // 부드러운 스크롤 효과 적용
    });
  };

	return (
		<main>
      <BrandInfo>
        {/* 오래된 트럭 방수 천을 기본 원단으로 삼아 자전거 바퀴 속 고무, 폐차 안전벨트를 더해 가방을 만듭니다. 낡아 버려질 것들이 세상에 단 하나뿐인 실용적이고 도시적인 프라이탁 가방으로 완성됩니다. */}
      </BrandInfo>
      
      <ProductList/>

			<ScrollTopBtn>
				<button
					type="button"
					className={showButton ? "on" : ""}
					onClick={scrollToTop}
				></button>
			</ScrollTopBtn>

			{/* <ScrollTopBtn
				type="button"
				className={showButton ? "on" : ""}
				onClick={scrollToTop}
			/> */}

      {modalView !== "off" &&
        <Modal>
          {
            modalView === "upload" ? <UploadForm />
            : modalView === "login" ? <LoginForm />
            : modalView === "register" ? <RegisterForm />
            : modalView === "details" && <Details />
          }
        </Modal>
      }
		</main>
	)
}

export default MainPage