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
import { AuthContext } from "../context/AuthContext";
// import freitagBG from "../components/images/freitag_bg.jpg";
import freitagBG from "../components/images/truck.jpg";
const ADMIN_ID = process.env.REACT_APP_ADMIN_ID; //관리자 확인용
const GUEST_ID = process.env.REACT_APP_GUEST_ID; //게스트 확인용

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
	&:after{
		content:"";
		position:absolute;
		inset:0;
		/* background-color:rgba(0,0,0,0.5); */
		background-color:rgba(255,255,255,0.1);
	}
`;
const UploadBtn = styled.button`
  padding:7px;
  font-size:14px;
  border-radius:6px;
  border:1px solid rgba(0, 0, 0, 0.05);
  color:#111;
  background-color:#e7e7e7;
`;

const MainPage = () => {
	const {modalView, setModalView} = useContext(ModalContext);
	const {userInfo} = useContext(AuthContext);

	return (
		<Wrap>
      <BrandInfo>
        {/* 오래된 트럭 방수 천을 기본 원단으로 삼아 자전거 바퀴 속 고무, 폐차 안전벨트를 더해 가방을 만듭니다. 낡아 버려질 것들이 세상에 단 하나뿐인 실용적이고 도시적인 프라이탁 가방으로 완성됩니다. */}
      </BrandInfo>

      {userInfo && 
        ((userInfo.userID) === ADMIN_ID ||
        (userInfo.userID) === GUEST_ID) &&

        <UploadBtn type="button" onClick={() => setModalView("upload")}>상품 업로드</UploadBtn>
      }
      
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