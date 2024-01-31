import React, { createContext, useState, useEffect } from "react";

export const ModalContext = createContext();

export const ModalProvider = (prop) => {
	const [modalView, setModalView] = useState(0);

	useEffect(() => {
    if (modalView) document.body.classList.add("scroll-ban");
    else document.body.classList.remove("scroll-ban");
  }, [modalView])
	
	return (
		<ModalContext.Provider value={{modalView, setModalView}}>
			{prop.children}
		</ModalContext.Provider>
	)
};