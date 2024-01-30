import { FormEvent, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import sanctumAxiosClient from '../api/sanctum-client';
import axiosClient from '../api/axios-client';
import { useStateContext } from '../contexts/ContextProvider';

const Login = () => {
	const emailRef = useRef<HTMLInputElement>(null);
	const passwordRef = useRef<HTMLInputElement>(null);

	const navigate = useNavigate();
	const { setToken } = useStateContext();

	const onSubmit = async (ev: FormEvent<HTMLFormElement>) => {
		ev.preventDefault();

		const payload = {
			email: emailRef.current?.value,
			password: passwordRef.current?.value,
		};

		sanctumAxiosClient.get('/csrf-cookie').then(() => {
			axiosClient
				.post('/login', payload)
				.then(({ data }) => {
					setToken(data.token);
					navigate('/posts');
				})
				.catch((err) => {
					const response = err.response;
					if (response && response.status === 422) {
						console.log(response.data.errors);
					}
				});
		});
	};

	return (
		<div className='mt-6 flex items-center justify-center'>
			<form
				onSubmit={onSubmit}
				className='bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full'
			>
				<div className='mb-4'>
					<label
						className='block text-gray-700 text-sm font-bold mb-2'
						htmlFor='email'
					>
						Email
					</label>
					<input
						className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
						id='email'
						type='text'
						ref={emailRef}
						placeholder='john@testing.com'
					/>
				</div>
				<div className='mb-4'>
					<label
						className='block text-gray-700 text-sm font-bold mb-2'
						htmlFor='password'
					>
						Password
					</label>
					<input
						className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline'
						id='password'
						ref={passwordRef}
						type='password'
						placeholder='******************'
					/>
					{/* <p className='text-red-500 text-xs italic'>Please choose a password.</p> */}
				</div>
				<div className='flex items-center justify-center'>
					<button
						// className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full'
						className='bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded w-full'
						type='submit'
					>
						Sign In
					</button>
				</div>
				<p className='message mt-5 text-xs text-center'>
					Not registered yet?
					<Link
						to='/sign-up'
						className='ml-3'
					>
						Create an account
					</Link>
				</p>
			</form>
		</div>
	);
};

export default Login;
