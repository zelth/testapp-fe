import { Navigate, createBrowserRouter } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Posts from './pages/Posts';
import NotFound from './pages/NotFound';
import DefaultLayout from './components/DefaultLayout';
import GuestLayout from './components/GuestLayout';

const router = createBrowserRouter([
	{
		path: '/',
		element: <DefaultLayout />,
		children: [
			{
				path: '/',
				element: <Navigate to='/posts' />,
			},
			{
				path: '/posts',
				element: <Posts />,
			},
		],
	},
	{
		path: '/',
		element: <GuestLayout />,
		children: [
			{
				path: 'login',
				element: <Login />,
			},
			{
				path: '/sign-up',
				element: <Signup />,
			},
		],
	},
	{
		path: '*',
		element: <NotFound />,
	},
]);

export default router;
