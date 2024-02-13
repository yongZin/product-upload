//회원정보 관련 컴포넌트
import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const [userInfo, setUserInfo] = useState();

	useEffect(() => {
		const sessionId = localStorage.getItem("sessionId"); //로그인시 세션ID 저장

		if(userInfo) {
			axios.defaults.headers.common.sessionid = userInfo.sessionId; //로그인 정보에 세션id 넣어주기
			localStorage.setItem("sessionId", userInfo.sessionId);//새로고침시 로그아웃 방지 (localStorage에 세션id저장)
		}
		else if(sessionId) { //세션id가 존재하면 API호출
			axios
			.get(
				"/users/userInfo",
				{ headers: { sessionid: sessionId } }
				)
				.then((result) => {
					setUserInfo({
						sessionId: result.data.sessionId,
						name: result.data.name,
						userID: result.data.userID,
					});
					// setUserInfo(result.data)
				})
				.catch(() => {
					localStorage.removeItem("sessionId");
					delete axios.defaults.headers.common.sessionid;
				});
		}
		else { //로그인 정보에 과거 세션id 지우기
			delete axios.defaults.headers.common.sessionid;
		} 
	}, [userInfo]);
	
	return(
		<AuthContext.Provider value={{userInfo, setUserInfo}}>
			{children}
		</AuthContext.Provider>
	);
}