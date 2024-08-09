import { Id, toast } from 'react-toastify';

/**
 * Creates a loading toast notification with the provided message.
 *
 * @param message - The message to display in the loading toast.
 * @returns Id - The unique identifier for the toast notification, which can be used to update or remove the toast.
 *
 * The function uses the `toast.loading` method from the `react-toastify` library to show a loading spinner with the given message.
 */
export function createLoadingToast(message: string): Id {
	return toast.loading(message);
}

/**
 * Updates an existing toast notification to display a success message.
 *
 * @param toastId - The unique identifier of the toast notification to update.
 * @param message - The success message to display in the toast notification.
 *
 * The function uses the `toast.update` method from the `react-toastify` library to update an existing toast
 * with a success type and the provided message. The toast will no longer show the loading spinner and will
 * have various display options configured.
 */
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

/**
 * Updates an existing toast notification to display an error message with a title.
 *
 * @param toastId - The unique identifier of the toast notification to update.
 * @param title - The title to display in the error toast.
 * @param message - The error message to display in the toast.
 *
 * The function uses the `toast.update` method from the `react-toastify` library to update an existing toast
 * with an error type, incorporating both a title and a message. The toast will no longer show the loading
 * spinner and will have various display options configured.
 */
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

/**
 * Displays a success toast notification with the provided message.
 *
 * @param message - The success message to display in the toast notification.
 *
 * The function uses the `toast` method from the `react-toastify` library to show a success message
 * with various display options configured, such as position, auto-close timing, and interactivity options.
 * This toast notification does not require any subsequent updates and is displayed immediately.
 */
export function pusherToast(message: string) {
	toast.success(message, {
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
