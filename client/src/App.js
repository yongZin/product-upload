import React, { useContext } from "react";
import { ToastContainer } from "react-toastify"; //alert 라이브러리
import styled from "styled-components";
import "react-toastify/dist/ReactToastify.css";
import Modal from "./components/Modal";
import UploadForm from "./components/UploadForm";
import ProductList from "./components/ProductList";
import Navigation from "./components/Navigation";
import LoginForm from "./components/LoginForm";
import { ModalContext } from "./context/ModalContext";

const Container = styled.div`
  margin:0 auto;
  padding:100px 0 0;
  @media ${props => props.theme.tablet} {
		padding:100px 0 0;
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

const App = () => {
  const {modalView, setModalView} = useContext(ModalContext);

  return (
    <Container>
      <ToastContainer />
      <Navigation />
      <UploadBtn type="button" onClick={() => setModalView(1)}>상풉 업로드</UploadBtn>
      <ProductList/>
      {modalView > 0 &&
        <Modal>
          {
            modalView === 1 ? <UploadForm />
            : modalView === 2 && <LoginForm />
          }
        </Modal>
      }
    </Container>
  )
}

export default App