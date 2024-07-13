//회원정보 관련 컴포넌트
import React, { createContext, useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { ModalContext } from "./ModalContext";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const [userInfo, setUserInfo] = useState();
	const [name, setName] = useState("");
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [passwordCheck, setPasswordCheck] = useState("");
	const [loginLoad, setLoginLoag] = useState(false);
	const {handleClose, setLoginCheck} = useContext(ModalContext);

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

	const loginHandler = async (e) => {
		try {
			e.preventDefault();

			if(username.length < 3 || password.length < 6)
				throw new Error("입력하신 정보가 올바르지 않습니다.");

			setLoginLoag(true);

			const result = await axios.patch(
				"/users/login",
				{ username, password }
			);

			setUserInfo({
				userID: result.data.userID,
				sessionId: result.data.sessionId,
				name: result.data.name,
			});
			
			handleClose();
			resetData();
			setLoginLoag(false);
			setLoginCheck(true);
			toast.success("로그인 성공");
		} catch (error) {
			console.error(error.response);
			toast.error(error.response.data.message);
		}
	};

	const resetData = () => {
		setName("");
		setUsername("");
		setPassword("");
		setPasswordCheck("");
	}

	const AuthContextValue = {
		userInfo, setUserInfo,
		name, setName,
		username, setUsername,
		password, setPassword,
		passwordCheck, setPasswordCheck,
		loginLoad, setLoginLoag,
		loginHandler, resetData
	}
	
	return(
		<AuthContext.Provider value={AuthContextValue}>
			{children}
		</AuthContext.Provider>
	);
}