import {
	createContext,
	useReducer,
	useEffect,
	type ReactNode,
	type Dispatch,
	useState,
} from "react";

import {
	AuthReducer,
	initialState,
	type AuthState,
	type Action,
} from "../reducer/authReducer";

import { loginUser, registerUser } from "../api/authApi";

type AuthContextType = {
	state: AuthState;
	dispatch: Dispatch<Action>;
	login: (email: string, password: string) => Promise<void>;
	register: (name: string, email: string, password: string) => Promise<void>;
	logout: () => void;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const [isInitialized, setIsInitialized] = useState(false);
	const [state, dispatch] = useReducer(AuthReducer, initialState);

	const register = async (name: string, email: string, password: string) => {
		try {
			dispatch({ type: "LOGIN_START" });

			const data = await registerUser(name, email, password);

			dispatch({
				type: "LOGIN_SUCCESS",
				payload: {
					user: data.user,
					token: data.token,
				},
			});

			localStorage.setItem("token", data.token);
		} catch (error: any) {
			const message =
				error?.response?.data?.message ||
				error.message ||
				"Register failed";

			dispatch({
				type: "LOGIN_ERROR",
				payload: message,
			});
		}
	};

	const login = async (email: string, password: string) => {
		try {
			dispatch({ type: "LOGIN_START" });

			const data = await loginUser(email, password);

			dispatch({
				type: "LOGIN_SUCCESS",
				payload: {
					user: data.user,
					token: data.token,
				},
			});

			localStorage.setItem("token", data.token);
		} catch (error: any) {
			const message =
				error?.response?.data?.message ||
				error.message ||
				"Login failed";

			dispatch({
				type: "LOGIN_ERROR",
				payload: message,
			});
		}
	};

	const logout = () => {
		localStorage.removeItem("token");

		dispatch({ type: "LOGOUT" });
	};

	useEffect(() => {
		const token = localStorage.getItem("token");

		if (token) {
			dispatch({
				type: "LOGIN_SUCCESS",
				payload: {
					user: null,
					token,
				},
			});
		}

		setIsInitialized(true);
	}, []);

	if (!isInitialized) {
		return <></>;
	}

	return (
		<AuthContext.Provider
			value={{
				state,
				dispatch,
				register,
				login,
				logout,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};
