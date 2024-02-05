import React from "react";
import { ToastContainer } from "react-toastify"; //alert 라이브러리
import "react-toastify/dist/ReactToastify.css";
import styled from "styled-components";
import { BrowserRouter as Router, Route } from "react-router-dom";
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
      <Router>
        <Navigation />
        <Route path="/" element={<MainPage />} />
      </Router>
      <MainPage />
    </Container>
  )
}

export default App