import { FormEvent, useEffect, useRef, useState } from 'react';
import CustomModal from '../components/CustomModal';
import sanctumAxiosClient from '../api/sanctum-client';
import axiosClient from '../api/axios-client';
import { PostProps, useStateContext } from '../contexts/ContextProvider';
import formatDate from '../utils/DateFormatter';

const Posts = () => {
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
	const [selectedPost, setSelectedPost] = useState<PostProps | null>(null);
	const [isEditMode, setIsEditMode] = useState<boolean>(false);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [totalPages, setTotalPages] = useState<number>(0);

	const titleRef = useRef<HTMLInputElement>(null);
	const descriptionRef = useRef<HTMLTextAreaElement>(null);

	const { post, setPost } = useStateContext();

	const toggleModal = () => {
		setIsEditMode(false);
		setIsModalOpen(!isModalOpen);
	};

	const toggleEditModal = (post: PostProps) => {
		setIsEditMode(true);
		setSelectedPost(post);
		setIsModalOpen(true);
	};

	const toggleDeleteModal = () => {
		setIsDeleteModalOpen(!isDeleteModalOpen);
	};

	useEffect(() => {
		axiosClient
			.get(`/posts?page=${currentPage}`)
			.then(({ data }) => {
				setPost(data.data);
				const lastPageUrl = data.links.last;
				const lastPage = lastPageUrl ? parseInt(lastPageUrl.split('=')[1]) : 1;
				setTotalPages(lastPage);
			})
			.catch((error) => {
				console.error('Error fetching posts:', error);
			});
	}, [currentPage]);

	const onSubmit = (ev: FormEvent<HTMLFormElement>) => {
		ev.preventDefault();

		const payload = {
			title: titleRef.current?.value,
			description: descriptionRef.current?.value,
		};

		sanctumAxiosClient.get('/csrf-cookie').then(() => {
			axiosClient
				.post('/posts', payload)
				.then(() => {
					toggleModal();
					setCurrentPage(1);
					axiosClient.get('/posts').then(({ data }) => {
						setPost(data.data);
					});
				})
				.catch((err) => {
					const response = err.response;
					if (response && response.status === 422) {
						console.log(response.data.errors);
					}
				});
		});
	};

	const handleEdit = (ev: FormEvent<HTMLFormElement>) => {
		ev.preventDefault();

		const payload = {
			title: titleRef.current?.value,
			description: descriptionRef.current?.value,
		};

		sanctumAxiosClient.get('/csrf-cookie').then(() => {
			axiosClient
				.put(`/posts/${selectedPost?.id}`, payload)
				.then(() => {
					setIsModalOpen(false);
					axiosClient.get('/posts').then(({ data }) => {
						setPost(data.data);
					});
				})
				.catch((err) => {
					const response = err.response;
					if (response && response.status === 422) {
						console.log(response.data.errors);
					}
				});
		});
	};

	const handleDelete = (id: string) => {
		// Open modal here before deleting the post
		setSelectedPost(post?.find((p) => p.id === id) || null);
		setIsDeleteModalOpen(true);
	};

	const handlePaginationClick = (page: number) => {
		setCurrentPage(page);
	};

	const confirmDelete = (id: string) => {
		axiosClient
			.delete(`/posts/${id}`)
			.then(() => {
				setIsDeleteModalOpen(false);
				axiosClient.get('/posts').then(({ data }) => {
					setPost(data.data);
				});
			})
			.catch((err) => {
				const response = err.response;
				if (response && response.status === 422) {
					console.log(response.data.errors);
				}
			});
	};

	return (
		<div>
			<div className='flex justify-end'>
				<button
					className='bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded'
					onClick={toggleModal}
				>
					Create a Post
				</button>
			</div>
			{post?.length !== 0 ? (
				<div className='flex flex-col'>
					<div className='inline-block min-w-full py-2'>
						<div className=''>
							<table className='min-w-full text-left text-sm font-light border-collapse w-full'>
								<thead className='border-b font-medium dark:border-neutral-500'>
									<tr>
										<th
											scope='col'
											className='px-4 py-4'
										></th>
										<th
											scope='col'
											className='px-4 py-4'
										>
											Title
										</th>
										<th
											scope='col'
											className='px-4 py-4'
										>
											Description
										</th>
										<th
											scope='col'
											className='px-4 py-4'
										>
											Date
										</th>
										<th
											scope='col'
											className='px-6 py-4'
										>
											Status
										</th>
									</tr>
								</thead>
								<tbody>
									{post?.map((post, index) => (
										<tr
											key={post.id}
											style={{ border: '1px solid #ddd' }}
										>
											<td className='p-4'>{index + 1}.</td>
											<td className='p-4'>{post.attributes.title}</td>
											<td className='p-4 w-[200px] max-w-[600px] overflow-hidden text-ellipsis whitespace-nowrap'>
												{post.attributes.description}
											</td>
											<td className='p-4'>
												{formatDate({ dateString: post.attributes.created_at })}
											</td>
											<td>
												<button
													className='edit p-2 mr-4 group text-gray-600 border border-gray-600 rounded-lg hover:border-gray-600 hover:bg-gray-100'
													type='button'
													onClick={() => toggleEditModal(post)}
												>
													<svg
														viewBox='0 0 1024 1024'
														fill='currentColor'
														height='1rem'
														width='1rem'
													>
														<path d='M880 836H144c-17.7 0-32 14.3-32 32v36c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-36c0-17.7-14.3-32-32-32zm-622.3-84c2 0 4-.2 6-.5L431.9 722c2-.4 3.9-1.3 5.3-2.8l423.9-423.9a9.96 9.96 0 000-14.1L694.9 114.9c-1.9-1.9-4.4-2.9-7.1-2.9s-5.2 1-7.1 2.9L256.8 538.8c-1.5 1.5-2.4 3.3-2.8 5.3l-29.5 168.2a33.5 33.5 0 009.4 29.8c6.6 6.4 14.9 9.9 23.8 9.9z' />
													</svg>
												</button>
												<button
													className='delete p-2 group text-gray-600 border border-gray-600 rounded-lg hover:border-gray-600 hover:bg-gray-100'
													type='button'
													onClick={() => handleDelete(post.id)}
												>
													<svg
														className='fill-red-500 group-hover:fill-red-700'
														viewBox='0 0 24 24'
														fill='currentColor'
														height='1rem'
														width='1rem'
													>
														<path d='M6 7H5v13a2 2 0 002 2h10a2 2 0 002-2V7H6zm4 12H8v-9h2v9zm6 0h-2v-9h2v9zm.618-15L15 2H9L7.382 4H3v2h18V4z' />
													</svg>
												</button>
											</td>
										</tr>
									))}
								</tbody>
							</table>
							<div className='mt-4 flex justify-center'>
								{Array.from({ length: totalPages }, (_, index) => {
									const pageNumber = index + 1;
									return (
										<button
											key={index}
											onClick={() => handlePaginationClick(pageNumber)}
											className={`mx-1 px-3 py-1 bg-blue-500 text-white rounded ${
												currentPage === index + 1 ? 'bg-blue-600' : ''
											}`}
										>
											{pageNumber}
										</button>
									);
								})}
							</div>
						</div>
					</div>
				</div>
			) : (
				<div className='text-center lg:h-[calc(100vh-11rem)] flex justify-center items-center'>
					<div className='p-6'>
						<p className='mt-6 mb-4 text-baseleading-normal text-neutral-600 dark:text-neutral-200'>
							Nothing seems to be in here!
						</p>
						<p className='mt-6 mb-4 text-base  leading-normal text-neutral-600 dark:text-neutral-200'>
							Create a post instead!
						</p>
					</div>
				</div>
			)}
			<CustomModal
				isOpen={isModalOpen}
				onClose={toggleModal}
			>
				<div className='w-full'>
					<form onSubmit={isEditMode ? handleEdit : onSubmit}>
						<div className='mb-4'>
							<label
								className='block text-gray-700 text-sm font-bold mb-2'
								htmlFor='email'
							>
								Title
							</label>
							<input
								className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
								id='email'
								type='text'
								ref={titleRef}
								defaultValue={isEditMode ? selectedPost?.attributes.title : ''}
								placeholder='Title'
							/>
						</div>
						<div className='mb-4'>
							<label
								className='block text-gray-700 text-sm font-bold mb-2'
								htmlFor='password'
							>
								Description
							</label>
							<textarea
								className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
								id='description'
								rows={8}
								ref={descriptionRef}
								defaultValue={isEditMode ? selectedPost?.attributes.description : ''}
								placeholder='Add a description'
							/>
						</div>
						<div className='flex items-center justify-center'>
							<button
								className='bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded w-full'
								type='submit'
							>
								{isEditMode ? 'Save' : 'Create Post'}
							</button>
						</div>
					</form>
				</div>
			</CustomModal>
			{/* Custom Modal for Delete Confirmation */}
			<CustomModal
				isOpen={isDeleteModalOpen}
				onClose={toggleDeleteModal}
			>
				<div className='w-full'>
					<div className='w-28 h-28 mx-auto'>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							fill='none'
							viewBox='0 0 24 24'
							id='Delete'
						>
							<path
								fill='#ef4444'
								d='M15 3a1 1 0 0 1 1 1h2a1 1 0 1 1 0 2H6a1 1 0 0 1 0-2h2a1 1 0 0 1 1-1h6Z'
								className='color000000 svgShape'
							></path>
							<path
								fill='#ef4444'
								fill-rule='evenodd'
								d='M6 7h12v12a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V7Zm3.5 2a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 1 0v-9a.5.5 0 0 0-.5-.5Zm5 0a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 1 0v-9a.5.5 0 0 0-.5-.5Z'
								clip-rule='evenodd'
								className='color000000 svgShape'
							></path>
						</svg>
					</div>
					<p className='text-center mt-6'>Are you sure you want to delete this post?</p>
					<div className='flex items-center justify-center mt-10'>
						<button
							className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2'
							onClick={() => selectedPost && confirmDelete(selectedPost.id)}
						>
							Delete
						</button>
						<button
							className='bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
							onClick={toggleDeleteModal}
						>
							Cancel
						</button>
					</div>
				</div>
			</CustomModal>
		</div>
	);
};

export default Posts;
