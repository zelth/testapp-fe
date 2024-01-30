import { ReactNode, createContext, useContext, useState, useEffect } from 'react';

interface User {
	id: string;
	name: string;
	email: string;
}

export interface PostProps {
	id: string;
	attributes: {
		title: string;
		description: string;
		created_at: string;
		updated_at: string;
	};
}

interface StateContextProps {
	user: User | null;
	setUser: (user: User | null) => void;
	token: string | null;
	setToken: (token: string | null) => void;
	post: PostProps[] | null;
	setPost: (post: PostProps[] | null) => void;
	// setUser: Dispatch<SetStateAction<User | null>>;
}

const initialState: StateContextProps = {
	user: null,
	token: null,
	post: null,
	setUser: () => {},
	setToken: () => {},
	setPost: () => {},
};

const StateContext = createContext<StateContextProps>(initialState);

export const ContextProvider = ({ children }: { children: ReactNode }) => {
	const [user, setUser] = useState<User | null>(initialState.user);
	const [post, setPost] = useState<PostProps[] | null>(initialState.post);
	const [token, _setToken] = useState<string | null>(initialState.token);

	useEffect(() => {
		const storedToken = sessionStorage.getItem('token');
		if (storedToken) {
			_setToken(storedToken);
		}
	}, [_setToken]);

	const handleSetToken = (newToken: string | null) => {
		_setToken(newToken);
		if (newToken) {
			sessionStorage.setItem('token', newToken);
		} else {
			sessionStorage.removeItem('token');
		}
	};

	return (
		<StateContext.Provider
			value={{
				user,
				token,
				post,
				setUser,
				setToken: handleSetToken,
				setPost,
			}}
		>
			{children}
		</StateContext.Provider>
	);
};

export const useStateContext = () => useContext(StateContext);
