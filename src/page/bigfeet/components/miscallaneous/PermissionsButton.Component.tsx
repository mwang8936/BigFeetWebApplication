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
			? 'green-button-color'
			: btnType === ButtonType.CANCEL
			? 'gray-button-color'
			: btnType === ButtonType.DELETE
			? 'red-button-color'
			: 'blue-button-olor';

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
