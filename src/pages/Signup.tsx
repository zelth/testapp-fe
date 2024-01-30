import { FormEvent, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosClient from '../api/axios-client';
import sanctumAxiosClient from '../api/sanctum-client';
import Modal from '../components/RedirectModal';

const Signup = () => {
	const [isModalOpen, setIsModalOpen] = useState(false);

	const nameRef = useRef<HTMLInputElement>(null);
	const emailRef = useRef<HTMLInputElement>(null);
	const passwordRef = useRef<HTMLInputElement>(null);
	const passwordConfirmationRef = useRef<HTMLInputElement>(null);

	const navigate = useNavigate();

	const handleCloseModal = () => {
		setIsModalOpen(false);
		navigate('/login');
	};

	const onSubmit = async (ev: FormEvent<HTMLFormElement>) => {
		ev.preventDefault();

		const payload = {
			name: nameRef.current?.value,
			email: emailRef.current?.value,
			password: passwordRef.current?.value,
			password_confirmation: passwordConfirmationRef.current?.value,
		};

		sanctumAxiosClient.get('/csrf-cookie').then(() => {
			axiosClient
				.post('/register', payload)
				.then(() => {
					setIsModalOpen(true);
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
		<div className='min-h-96flex items-center justify-center'>
			<form
				onSubmit={onSubmit}
				className='bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4'
			>
				<div className='mb-4'>
					<label
						className='block text-gray-700 text-sm font-bold mb-2'
						htmlFor='name'
					>
						Full Name
					</label>
					<input
						className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
						id='name'
						ref={nameRef}
						type='text'
						placeholder='John Doe'
					/>
				</div>
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
						type='password'
						ref={passwordRef}
						placeholder='******************'
					/>
				</div>
				<div className='mb-4'>
					<label
						className='block text-gray-700 text-sm font-bold mb-2'
						htmlFor='passwordConfirmation'
					>
						Confirm password
					</label>
					<input
						className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline'
						id='passwordConfirmation'
						ref={passwordConfirmationRef}
						type='password'
						placeholder='******************'
					/>
				</div>
				<div className='flex items-center justify-center'>
					<button
						className='bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded w-full'
						type='submit'
					>
						Sign Up
					</button>
				</div>
				<p className='message mt-5 text-xs text-center'>
					Already Registered?
					<Link
						to='/login'
						className='ml-3'
					>
						Sign in
					</Link>
				</p>
			</form>
			{isModalOpen ? (
				<Modal
					isOpen
					onClose={handleCloseModal}
					timeout={4000}
					redirect={true}
					redirectPath='/login'
				>
					<div className='mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 sm:mx-0 mb-6'>
						<svg
							className='text-green-600'
							stroke='currentColor'
							fill='none'
							viewBox='0 0 24 24'
						>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth='2'
								d='M5 13l4 4L19 7'
							></path>
						</svg>
					</div>
					<h2 className='mb-4'>You have registered successfully!</h2>
					<p className='mb-4'>You will be redirected to login automatically...</p>
					<Link
						to='/login'
						className='bg-green-400 hover:bg-green-500 text-white hover:text-white font-bold py-2 px-4 border-b-4 border-green-700 hover:border-green-500 rounded w-full mt-5 text-center'
					>
						Redirect to login
					</Link>
				</Modal>
			) : null}
		</div>
	);
};

export default Signup;
