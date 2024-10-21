//회원정보 관련 컴포넌트
import React, { createContext, useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import { useLogin, useLogout, useUserInfo } from "../hooks/useAuth";
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

	const login = useLogin();
	const logout = useLogout();
	const sessionId = localStorage.getItem("sessionId");

	const { data: userData } = useUserInfo(sessionId);

	useEffect(() => {
		if(userData) {
			setUserInfo({
				sessionId: userData.sessionId,
				name: userData.name,
				userID: userData.userID,
			});
		}
	}, [userData]);

	const loginHandler = async (e) => {
		try {
			e.preventDefault();

			if(username.length < 3 || password.length < 6)
			throw new Error("입력하신 정보가 올바르지 않습니다.");

			const result = await login.mutateAsync({ username, password });
						
			setUserInfo({
				sessionId: result.sessionId,
				name: result.name,
				userId: result.userID,
			});

			handleClose();
			resetData();
			setLoginCheck(true);
			toast.success("로그인 성공");

			localStorage.setItem("sessionId", result.sessionId); //세션ID 저장
		} catch (error) {
			console.error(error);
      toast.error(error.response?.data.message || "로그인 실패");
		}
	};

	const logoutHandler = () => {
		logout.mutate(undefined, {
			onSuccess: () => {
				setUserInfo(null);
				toast.success("로그아웃");
			},
			onError: (error) => {
				console.error(error);
        toast.error("로그아웃 실패");
			}
		});
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
		loginHandler, logoutHandler,
		resetData
	}
	
	return(
		<AuthContext.Provider value={AuthContextValue}>
			{children}
		</AuthContext.Provider>
	);
}