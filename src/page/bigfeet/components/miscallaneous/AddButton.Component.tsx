import { useState } from 'react';
import AddDialog from './AddDialog.Component.tsx';

interface AddButtonProp {
	element: React.ReactNode;
	elementTitle: string;
	loading: boolean;
	disabled: boolean;
	missingPermissionMessage: string;
	onAdd(event: React.FormEvent<HTMLFormElement>): void;
	addBtnTitle: string;
	addingBtnTitle: string;
	addTitle: string;
	error: string;
	success: string;
}

export default function AddButton(prop: AddButtonProp) {
	const [showDialog, setShowDialog] = useState(false);

	return (
		<div className='flex flex-col items-end'>
			<button
				type='button'
				className='button my-2 w-fit group'
				disabled={prop.disabled}
				onClick={() => setShowDialog(true)}
			>
				<span className='button-tip mt-60 group-hover:group-disabled:scale-100'>
					{prop.missingPermissionMessage}
				</span>
				{prop.loading && (
					<svg
						className='animate-spin -ml-1 mr-3 h-5 w-5 text-white'
						xmlns='http://www.w3.org/2000/svg'
						fill='none'
						viewBox='0 0 24 24'
					>
						<circle
							className='opacity-25'
							cx='12'
							cy='12'
							r='10'
							stroke='currentColor'
							strokeWidth='4'
						/>
						<path
							className='opacity-75'
							fill='currentColor'
							d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
						/>
					</svg>
				)}
				{prop.loading ? prop.addingBtnTitle : prop.addBtnTitle}
			</button>
			<AddDialog
				open={showDialog}
				setOpen={setShowDialog}
				onCreateButtonClicked={(event) => {
					event.preventDefault();
					setShowDialog(false);
					prop.onAdd(event);
				}}
				title={prop.elementTitle}
				element={prop.element}
			/>
			{prop.error ? (
				<p className='error-label my-auto'>{prop.error}</p>
			) : (
				prop.success && (
					<p className='error-label text-green-600 my-auto'>
						{prop.success}
					</p>
				)
			)}
		</div>
	);
}
