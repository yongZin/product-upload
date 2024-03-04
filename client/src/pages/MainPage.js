//메인 페이지 컴포넌트
import React, { useContext } from "react";
import styled from "styled-components";
import Modal from "../components/Modal";
import UploadForm from "../components/UploadForm";
import ProductList from "../components/ProductList";
import LoginForm from "../components/LoginForm";
import RegisterForm from "../components/RegisterForm";
import Details from "../components/Details";
import { ModalContext } from "../context/ModalContext";
import freitagBG from "../components/images/truck.jpg";

const Wrap = styled.div`
  /* padding-top:64px; */
`;
const BrandInfo = styled.div`
	width:100%;
	height:500px;
	background:url(${freitagBG}) no-repeat;
	background-position:center;
	background-size:cover;
	position:relative;
	z-index:10;
	&:after{
		content:"";
		position:absolute;
		inset:0;
		/* background-color:rgba(0,0,0,0.5); */
		background-color:rgba(255,255,255,0.1);
	}
`;

const MainPage = () => {
	const {modalView} = useContext(ModalContext);

	return (
		<Wrap>
      <BrandInfo>
        {/* 오래된 트럭 방수 천을 기본 원단으로 삼아 자전거 바퀴 속 고무, 폐차 안전벨트를 더해 가방을 만듭니다. 낡아 버려질 것들이 세상에 단 하나뿐인 실용적이고 도시적인 프라이탁 가방으로 완성됩니다. */}
      </BrandInfo>
      
      <ProductList/>

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
		</Wrap>
	)
}

export default MainPage