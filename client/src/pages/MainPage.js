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
const ADMIN_ID = process.env.REACT_APP_ADMIN_ID; //관리자 확인용
const GUEST_ID = process.env.REACT_APP_GUEST_ID; //게스트 확인용

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
		<>
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
		</>
	)
}

export default MainPage