import { useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
	timeout?: number;
	redirect?: boolean;
	redirectPath?: string | undefined;
	children: ReactNode;
}

const RedirectModal = ({
	isOpen,
	onClose,
	timeout,
	redirect,
	redirectPath,
	children,
}: ModalProps) => {
	const navigate = useNavigate();

	useEffect(() => {
		if (isOpen) {
			const timer = setTimeout(() => {
				onClose();
				if (redirect) {
					navigate(`${redirectPath}`);
				}
			}, timeout);
			return () => clearTimeout(timer);
		}
	}, [isOpen, onClose, timeout, navigate, redirect, redirectPath]);

	return (
		<div className='modal-content fixed z-10 inset-0 overflow-y-auto'>
			<div className='fixed inset-0 bg-gray-500 opacity-75' />
			<div className='flex h-full justify-center items-center'>
				<div className='relative flex flex-col items-center justify-center bg-white rounded-lg px-4 pt-5 pb-4 text-left shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6'>
					<span
						className='close cursor-pointer absolute p-1 -right-2 -top-2 z-20 bg-red-100 rounded-full'
						onClick={onClose}
					>
						<svg
							fill='none'
							viewBox='0 0 24 24'
							height='1em'
							width='1em'
						>
							<path
								fill='#dc2626'
								d='M6.225 4.811a1 1 0 00-1.414 1.414L10.586 12 4.81 17.775a1 1 0 101.414 1.414L12 13.414l5.775 5.775a1 1 0 001.414-1.414L13.414 12l5.775-5.775a1 1 0 00-1.414-1.414L12 10.586 6.225 4.81z'
							/>
						</svg>
					</span>
					{children}
				</div>
			</div>
		</div>
	);
};

export default RedirectModal;
