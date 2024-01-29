import React, { useState, useEffect } from "react";
import { ToastContainer } from "react-toastify"; //alert 라이브러리
import styled from "styled-components";
import "react-toastify/dist/ReactToastify.css";
import Modal from "./components/Modal";
import UploadForm from "./components/UploadForm";
import ProductList from "./components/ProductList";

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
  const [modalView, setModalView] = useState(0);

  useEffect(() => {
    if (modalView) document.body.classList.add("scroll-ban");
    else document.body.classList.remove("scroll-ban")
  }, [modalView])

  return (
    <Container>
      <ToastContainer />
      <UploadBtn type="button" onClick={() => setModalView(1)}>상풉 업로드</UploadBtn>
      <ProductList />
      {modalView > 0 &&
        <Modal setModalView={setModalView}>
          {modalView === 1 &&
            <UploadForm setModalView={setModalView} />
          }
          {/* {modalView === 1 ?
            <UploadForm setModalView={setModalView} />

            : modalView === 2 ?
            <p>222222</p>

            : modalView === 3 &&
            <p>3333333</p>
          } */}
        </Modal>
      }
    </Container>
  )
}

export default App