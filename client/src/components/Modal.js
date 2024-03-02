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
  &.form{
    &-close{
      & + div{
        animation:close ease 0.4s;
      }
    }
  }
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
  animation:open ease 0.25s;
  &.form{
    &-upload{ //상품 업로드
      width:82%;
      height:88vh;
      form{
        padding:0 6px 10px;
      }
    }
    &-user{ //로그인 & 회원가입
      width:65%;
      max-width:600px;
      padding-bottom:40px;
    }
    &-details{  //상품 상세
      width:82%;
      height:88vh;
      padding:60px 30px;
      >div{
        &::-webkit-scrollbar{
          width:14px;
          background-color:transparent;
          &-thumb{
            border-radius:10px;
            border:4px solid transparent;
            background-clip:padding-box;
            background-color:#b9b9b9;
          }
        }
      }
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
  @keyframes open {
    0%{
      top:-100%;
    }
    100%{
      top:9%;
    }
  }
  @keyframes close {
    0%{
      top:9%;
    }
    100%{
      top:-100%;
    }
  }
`;

const Modal = ({ children }) => {
  const {
    modalView,
    close,
    handleClose
  } = useContext(ModalContext);

	return (
		<>
      <Background
        className={close ? "form-close" : ""}
        onClick={handleClose}
      />

      <Popup
        className={
         modalView === "upload" ? "form-upload"
          : (
            modalView === "login" ||
            modalView === "register"
          ) ? "form-user"
          : modalView === "details" && "form-details"
        }
      >
        {children}
      </Popup>
    </>
	)
}

export default Modal