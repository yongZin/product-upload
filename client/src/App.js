import React, { useState, useEffect } from "react";
import { ToastContainer } from "react-toastify"; //alert 라이브러리
import styled from "styled-components";
import "react-toastify/dist/ReactToastify.css";
import Modal from "./components/Modal";
import UploadForm from "./components/UploadForm";

const Container = styled.div`
  margin:0 auto;
  padding:100px 0 0;
  @media ${props => props.theme.tablet} {
		padding:100px 0 0;
  }
`;

const App = () => {
  const [modalView, setModalView] = useState(false);

  useEffect(() => {
    if (modalView) document.body.classList.add("scroll-ban");
    else document.body.classList.remove("scroll-ban")
  }, [modalView])

  return (
    <Container>
      <ToastContainer />
      <Modal setModalView={setModalView}>
        <UploadForm setModalView={setModalView} />
      </Modal>
    </Container>
  )
}

export default App