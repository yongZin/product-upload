import React from "react";
import { ToastContainer } from "react-toastify"; //alert 라이브러리
import "react-toastify/dist/ReactToastify.css";
import styled from "styled-components";
import { Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation";
import MainPage from "./pages/MainPage";

const Container = styled.div`
  margin:0 auto;
  padding:100px 0 0;
  @media ${props => props.theme.tablet} {
		padding:100px 0 0;
  }
`;

const App = () => {
  return (
    <Container>
      <ToastContainer />
      <Navigation />
      <Routes>
        <Route path="/" element={<MainPage />} />
      </Routes>
    </Container>
  )
}

export default App