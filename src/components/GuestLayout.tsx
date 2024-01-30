import { Outlet, Navigate } from 'react-router-dom';
import { useStateContext } from '../contexts/ContextProvider';
import logo from '../assets/imgs/logo.png';

const GuestLayout = () => {
	const { token } = useStateContext();

	if (token) {
		return <Navigate to='/' />;
	}

	return (
		<div className='flex h-full justify-center items-center bg-stone-200'>
			<div className='w-full md:w-1/2 lg:w-[500px] px-10'>
				<div className='logo-container flex justify-center items-center'>
					<img
						src={logo}
						alt='React Image'
						width={200}
					/>
				</div>
				<Outlet />
			</div>
		</div>
	);
};

export default GuestLayout;
