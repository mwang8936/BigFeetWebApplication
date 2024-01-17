import { FC } from 'react';
import { ButtonType } from '../PermissionsButton.Component';

interface ModalPermissionsButtonProp {
	btnTitle: string;
	btnType?: ButtonType;
	top?: boolean;
	right?: boolean;
	disabled: boolean;
	missingPermissionMessage: string;
	onClick(): void;
}

const ModalPermissionsButton: FC<ModalPermissionsButtonProp> = ({
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
			? 'bg-green-600 hover:bg-green-500 disabled:bg-green-300'
			: btnType === ButtonType.CANCEL
			? 'ring-1 ring-inset ring-gray-300 bg-white hover:bg-gray-50 text-gray-900'
			: btnType === ButtonType.DELETE
			? 'bg-red-600 hover:bg-red-500 disabled:bg-red-300'
			: 'bg-blue-600 hover:bg-blue-500 disabled:bg-blue-300';

	const tipOriginCss =
		'origin' + (top ? '-bottom' : '-top') + (right ? '-right' : '-left');
	const tipLocationCss =
		(top ? 'bottom-[100%]' : 'top-[100%]') +
		' ' +
		(right ? 'right-[0%]' : 'left-[0%]');

	return (
		<button
			type="button"
			className={`modal-button ${btnColorCss} group`}
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

export default ModalPermissionsButton;
