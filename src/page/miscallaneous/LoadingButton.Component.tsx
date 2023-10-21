interface LoadingButtonProp {
	loading: boolean;
	disabled: boolean;
	missingPermissionMessage: string;
	missingPermissionMessageDirection: string;
	color: string;
	loadBtnTitle: string;
	loadingBtnTitle: string;
	error: string;
	success: string;
}

export default function LoadingButton(prop: LoadingButtonProp) {
	return (
		<>
			<button className='button' type='submit' disabled={prop.disabled}>
				{prop.loading && (
					<svg
						className='white-spin'
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
				{prop.loading ? prop.loadingBtnTitle : prop.loadBtnTitle}
			</button>
			{prop.error ? (
				<p className='error-label'>{prop.error}</p>
			) : (
				prop.success && <p className='success-label'>{prop.success}</p>
			)}
		</>
	);
}
