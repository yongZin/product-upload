import React from "react";
import { ToastContainer } from "react-toastify"; //alert 라이브러리
import "react-toastify/dist/ReactToastify.css";
import styled from "styled-components";
import { Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";
import MainPage from "./pages/MainPage";

const Container = styled.div`
  margin:0 auto;
`;

const App = () => {
  return (
    <Container>
      <ToastContainer />
      <Navigation />
      <Routes>
        <Route path="/" element={<MainPage />} />
      </Routes>
      <Footer />
    </Container>
  )
}

export default App