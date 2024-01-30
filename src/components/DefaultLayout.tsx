import { MouseEvent, useEffect } from 'react';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import { useStateContext } from '../contexts/ContextProvider';
import axiosClient from '../api/axios-client';
import logo from '../assets/imgs/logo.png';
import CustomLink from './CustomLink';

const DefaultLayout = () => {
	const { user, token, setToken, setUser } = useStateContext();

	const navigate = useNavigate();

	useEffect(() => {
		axiosClient
			.get('/user')
			.then(({ data }) => {
				setUser(data);
			})
			.catch((err) => {
				const response = err.response;
				if (response && response.status === 422) {
					console.log(response.data.errors);
				}
			});
	}, [setUser]);

	if (!token) {
		return <Navigate to='/login' />;
	}

	const onLogout = (ev: MouseEvent) => {
		ev.preventDefault();
		setToken('');
		navigate('/login');
	};

	return (
		<div
			id='defaultLayout'
			className='flex h-dvh'
		>
			<aside className='bg-gray-200 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] w-96'>
				<div className='logo-container flex justify-center items-center my-6'>
					<img
						src={logo}
						alt='React Image'
						width={100}
					/>
				</div>
				<CustomLink
					to='/posts'
					additionalClassName='w-full flex items-center p-5 text-white hover:text-gray-200'
				>
					<svg
						fill='currentColor'
						viewBox='0 0 16 16'
						height='1.2rem'
						width='1.2rem'
						className='mr-1'
					>
						<path d='M9.293 0H4a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V4.707A1 1 0 0013.707 4L10 .293A1 1 0 009.293 0zM9.5 3.5v-2l3 3h-2a1 1 0 01-1-1zm-5-.5H7a.5.5 0 010 1H4.5a.5.5 0 010-1zm0 3h7a.5.5 0 01.5.5v7a.5.5 0 01-.5.5h-7a.5.5 0 01-.5-.5v-7a.5.5 0 01.5-.5z' />
					</svg>
					Posts
				</CustomLink>
			</aside>
			<div className='content overflow-y-scroll w-dvw'>
				<header className='bg-[#D3D594] flex p-5 justify-between items-center [@media(max-width:1024px)]:w-[calc(100dvw-15rem)] w-[calc(100dvw-15rem)] fixed md:w-[calc(100dvw-21rem)] lg:w-[calc(100dvw-21rem)]'>
					<p className='mr-4 text-white'>Hello {user?.name.split(' ')[0]}!</p>
					<button
						type='button'
						className='btn-logout rounded px-6 pb-2 pt-2.5 text-xs font-medium leading-normal text-primary transition duration-150 ease-in-out hover:bg-neutral-100 hover:text-primary-600 focus:text-primary-600 focus:outline-none focus:ring-0 active:text-primary-700 dark:hover:bg-neutral-700'
						onClick={onLogout}
					>
						Logout
					</button>
				</header>
				<main className='p-5 lg:h-[calc(100dvh-5rem)] mt-20'>
					<Outlet />
				</main>
			</div>
		</div>
	);
};

export default DefaultLayout;
