//메인 페이지 컴포넌트
import React, { useState, useContext, useEffect } from "react";
import styled from "styled-components";
import Modal from "../components/Modal";
import UploadForm from "../components/UploadForm";
import ProductList from "../components/ProductList";
import LoginForm from "../components/LoginForm";
import RegisterForm from "../components/RegisterForm";
import Details from "../components/Details";
import Loading from "../components/Loading";
import { ModalContext } from "../context/ModalContext";
import { ProductContext } from "../context/ProductContext";
// import { AuthContext } from "../context/AuthContext";
import freitagBG from "../components/images/truck.jpg";
// const GUEST_ID = process.env.REACT_APP_GUEST_LOGIN_ID; //임시관리자 ID
// const GUEST_PWD = process.env.REACT_APP_GUEST_LOGIN_PWD; //임시관리자 Password

const BrandInfo = styled.section`
	width:100%;
	height:500px;
	background:url(${freitagBG}) no-repeat;
	background-attachment:fixed;
	background-position:top center;
	background-size:auto 500px;
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
		background-size:auto 350px;
	}
	@media ${props => props.theme.mobile} {
		height:250px;
		background-size:auto 250px;
	}
	@media ${props => props.theme.mobile_xs} {
		height:180px;
		background-size:auto 180px;
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
	const {modalView, setModalView, loginCheck} = useContext(ModalContext);
	const {loadingFinish} = useContext(ProductContext);
	// const {setUsername, setPassword, loginHandler} = useContext(AuthContext);
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

	useEffect(() => { //로그인 유도(상품 렌더링 후)
		if (!loginCheck) setModalView("login");
	}, [loginCheck, setModalView]);

	// useEffect(() => { //로그인 유도(상품 렌더링 후)
	// 	if (!loginCheck) {
	// 		setUsername(GUEST_ID);
	// 		setPassword(GUEST_PWD);
	// 		loginHandler({ preventDefault: () => {} });
	// 	};
	// }, [loginCheck, setModalView, setUsername, setPassword, loginHandler]);

	const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };


	return (
		<main>
			{loadingFinish &&
				<Loading />
			}

      <BrandInfo />
      
      <ProductList/>

			<ScrollTopBtn>
				<button
					type="button"
					className={showButton ? "on" : ""}
					onClick={scrollToTop}
				></button>
			</ScrollTopBtn>

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