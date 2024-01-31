//모달 팝업 컴포넌트
import React, { useContext } from "react";
import styled from "styled-components";
import { ModalContext } from "../context/ModalContext";

const Background = styled.div`
	backdrop-filter:blur(2px);
  position:fixed;
  inset:0;
  z-index:1000;
  cursor:pointer;
`;
const Popup = styled.div`
  max-width:800px;
  max-height:88vh;
  padding:30px 20px;
  border:1px solid rgba(0, 0, 0, 0.1);
  border-radius:15px;
  box-shadow: 0 0 16px 0 rgba(0, 0, 0, 0.2);
  background-color:rgba(0, 0, 0, 0.1);
  backdrop-filter:blur(10px) saturate(100%) contrast(45%) brightness(130%);
  position:fixed;
  top:9%;
  left:50%;
  transform:translateX(-50%);
  overflow:hidden;
  z-index:1001;
  animation:fade cubic-bezier(.17,.67,.83,.67) 0.1s;
  &.form{
    &-upload{
      width:82%;
      height:88vh;
      form{
        padding:0 6px 10px;
      }
    }
    &-user{
      width:65%;
      max-width:600px;
    }
  }
  form{
    height:100%;
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

const Modal = ({ children }) => {
  const {modalView, setModalView} = useContext(ModalContext);
	return (
		<>
      <Background onClick={() => setModalView(0)} />

      <Popup
        className={
          modalView === 1 ? "form-upload"
          : modalView === 2 && "form-user"
        }
      >
        {children}
      </Popup>
    </>
	)
}

export default Modal