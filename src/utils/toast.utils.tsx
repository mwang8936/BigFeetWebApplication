import { Id, toast } from 'react-toastify';

export function createLoadingToast(message: string): Id {
	return toast.loading(message);
}

export function successToast(toastId: Id, message: string) {
	toast.update(toastId, {
		render: message,
		type: 'success',
		isLoading: false,
		position: 'top-right',
		autoClose: 5000,
		hideProgressBar: false,
		closeOnClick: true,
		pauseOnHover: true,
		pauseOnFocusLoss: true,
		draggable: true,
		theme: 'light',
	});
}

export function errorToast(toastId: Id, title: string, message: string) {
	toast.update(toastId, {
		render: (
			<h1>
				{title} <br />
				{message}
			</h1>
		),
		type: 'error',
		isLoading: false,
		position: 'top-right',
		autoClose: 5000,
		hideProgressBar: false,
		closeOnClick: true,
		pauseOnHover: true,
		pauseOnFocusLoss: true,
		draggable: true,
		theme: 'light',
	});
}

export function showToast(message: string) {
	toast(message, {
		type: 'success',
		isLoading: false,
		position: 'top-right',
		autoClose: 5000,
		hideProgressBar: false,
		closeOnClick: true,
		pauseOnHover: true,
		pauseOnFocusLoss: true,
		draggable: true,
		theme: 'light',
	});
}
