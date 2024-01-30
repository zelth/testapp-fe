import { ReactNode } from 'react';
import { NavLink, useLocation, LinkProps } from 'react-router-dom';

interface CustomLinkProps extends LinkProps {
	to: string;
	children: ReactNode;
	additionalClassName?: string;
}

const CustomLink = ({ to, children, additionalClassName, ...rest }: CustomLinkProps) => {
	const location = useLocation();
	const isActive = location.pathname === to;
	const backgroundStyle = isActive ? 'bg-[#D3D594]' : 'bg-white';

	return (
		<NavLink
			to={to}
			className={`${backgroundStyle} ${additionalClassName}`}
			{...rest}
		>
			{children}
		</NavLink>
	);
};

export default CustomLink;
