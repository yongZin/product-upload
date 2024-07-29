//모달 팝업 관련 상태관리
import React, { createContext, useState, useEffect } from "react";

export const ModalContext = createContext();

export const ModalProvider = (prop) => {
	const [modalView, setModalView] = useState("off");
	const [close, setClose] = useState(false);
	const [loginCheck, setLoginCheck] = useState(true);

	useEffect(() => {
    if (modalView !== "off") {
			document.body.classList.add("scroll-fix");
		} else if (modalView === "off") {
			document.body.classList.remove("scroll-fix");
		}
  }, [modalView])

	const handleClose = () => {
    setClose(true);

    setTimeout(() => {
      setModalView("off");
      setClose(false);
    }, 300);
  };
	
	return (
		<ModalContext.Provider value={{
			modalView, setModalView,
			close, setClose,
			loginCheck, setLoginCheck,
			handleClose
			}}>
			{prop.children}
		</ModalContext.Provider>
	)
};