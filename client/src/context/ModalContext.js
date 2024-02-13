//모달 팝업 관련 상태관리
import React, { createContext, useState, useEffect } from "react";

export const ModalContext = createContext();

export const ModalProvider = (prop) => {
	const [modalView, setModalView] = useState("off");
	const [close, setClose] = useState(false);

	useEffect(() => {
    if (modalView !== "off") {
			document.body.classList.add("scroll-fix");
		} else if (modalView === "off") {
			setTimeout(() => {
				document.body.classList.remove("scroll-fix");
			}, 500);
		}
  }, [modalView])
	
	return (
		<ModalContext.Provider value={{
			modalView, setModalView,
			close, setClose
			}}>
			{prop.children}
		</ModalContext.Provider>
	)
};