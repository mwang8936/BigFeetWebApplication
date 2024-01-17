import { FC } from 'react';

export enum ButtonType {
	ADD = 'ADD',
	CANCEL = 'CANCEL',
	DEFAULT = 'DEFAULT',
	DELETE = 'DELETE',
}

interface PermissionsButtonProp {
	btnTitle: string;
	btnType?: ButtonType;
	top?: boolean;
	right?: boolean;
	disabled: boolean;
	missingPermissionMessage: string;
	onClick(): void;
}

const PermissionsButton: FC<PermissionsButtonProp> = ({
	btnTitle,
	btnType = ButtonType.DEFAULT,
	top = true,
	right = true,
	disabled,
	missingPermissionMessage,
	onClick,
}) => {
	const btnColorCss =
		btnType === ButtonType.ADD
			? 'bg-green-500 hover:bg-green-700 disabled:bg-green-300'
			: btnType === ButtonType.CANCEL
			? 'bg-gray-500 hover:bg-gray-700 disabled:bg-gray-300'
			: btnType === ButtonType.DELETE
			? 'bg-red-500 hover:bg-red-700 disabled:bg-red-300'
			: 'bg-blue-500 hover:bg-blue-700 disabled:bg-blue-300';

	const tipOriginCss =
		'origin' + (top ? '-bottom' : '-top') + (right ? '-right' : '-left');
	const tipLocationCss =
		(top ? 'bottom-[100%]' : 'top-[100%]') +
		' ' +
		(right ? 'right-[0%]' : 'left-[0%]');

	return (
		<button
			type="button"
			className={`button ${btnColorCss} group`}
			disabled={disabled}
			onClick={onClick}>
			<span
				className={`button-tip ${tipLocationCss} ${tipOriginCss} group-hover:group-disabled:scale-100`}>
				{missingPermissionMessage}
			</span>
			{btnTitle}
		</button>
	);
};

export default PermissionsButton;
