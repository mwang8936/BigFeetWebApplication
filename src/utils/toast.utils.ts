import { Id, toast } from 'react-toastify';

export function createToast(message: string): Id {
	return toast.loading(message);
}

export function updateToast(toastId: Id, message: string) {
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

export function errorToast(toastId: Id, error: string | React.ReactNode) {
	toast.update(toastId, {
		render: error,
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
