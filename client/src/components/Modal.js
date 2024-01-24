import React from "react";
import styled from "styled-components";

const Background = styled.div`
  position:fixed;
  inset:0;
  z-index:1000;
`;
const Popup = styled.div`
  width:82%;
  max-width:1000px;
  height:88vh;
  padding:30px 20px;
  border:1px solid rgba(0, 0, 0, 0.05);
  border-radius:15px;
  box-shadow: 0 0 16px 0 rgba(0, 0, 0, 0.2);
  background-color:rgba(0, 0, 0, 0.05);
  backdrop-filter:blur(10px) saturate(100%) contrast(45%) brightness(130%);
  position:fixed;
  top:9%;
  left:50%;
  transform:translateX(-50%);
  overflow:hidden;
  z-index:1001;
  animation:fade cubic-bezier(.17,.67,.83,.67) 0.1s;
  form{
    height:100%;
    padding:0 6px 10px;
    overflow:auto;
    &::-webkit-scrollbar{
      width:12px;
      background-color:transparent;
      &-thumb{
        border-radius:10px;
        border:3px solid transparent;
        background-clip:padding-box;
        background-color:#fff;
      }
    }
  }
  @keyframes fade {
    0%{
      opacity:0;
    }
    100%{
      opacity:1;
    }
  }
`;

const Modal = ({ children, setModalView }) => {
	return (
		<>
      <Background onClick={() => {
        setModalView(false);
      }} />

      <Popup>
        {children}
      </Popup>
    </>
	)
}

export default Modal