// 회원가입정보 Nav로 보내주기
import React, { createContext, useEffect, useState } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const [me, setMe] = useState();

	useEffect(() => {
		const sessionId = localStorage.getItem("sessionId");

		if(me) {
			axios.defaults.headers.common.sessionid = me.sessionId; //로그인 정보에 세션id 넣어주기
			localStorage.setItem("sessionId", me.sessionId);//새로고침시 로그아웃 방지 (localStorage에 세션id저장)
		} else if(sessionId) { //세션id가 존재하면 API호출
			axios
				.get(
					"/users/me",
					{headers: { sessionid: sessionId }}
				)
				.then((result) => { //API호출 성공시
					setMe({
						userId: result.data.userId,
						sessionId: result.data.sessionId,
						name: result.data.name,
					});
				})
				.catch(() => {// 만료된 세션id 지우기
					localStorage.removeItem("sessionId");
					delete axios.defaults.headers.common.sessionid; //로그인 정보에 과거 세션id 지우기
				});
		} else delete axios.defaults.headers.common.sessionid; //로그인 정보에 과거 세션id 지우기
	}, [me]);
	
	return(
		<AuthContext.Provider value={[me, setMe]}>
			{children}
		</AuthContext.Provider>
	);
}