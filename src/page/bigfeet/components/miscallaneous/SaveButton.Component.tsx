interface SaveButtonProp {
	loading: boolean;
	disabled: boolean;
	missingPermissionMessage: string;
	saveBtnTitle: string;
	savingBtnTitle: string;
	error: string;
	success: string;
}

export default function SaveButton(prop: SaveButtonProp) {
	return (
		<div>
			<button
				type='submit'
				className='button group'
				disabled={prop.disabled}
			>
				<span className='button-tip group-hover:group-disabled:scale-100'>
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
				{prop.loading ? prop.savingBtnTitle : prop.saveBtnTitle}
			</button>
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
