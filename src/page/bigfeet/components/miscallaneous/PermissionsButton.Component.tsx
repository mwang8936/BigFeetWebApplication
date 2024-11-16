import { FC } from 'react';
import { useTranslation } from 'react-i18next';

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
	const { t } = useTranslation();

	const btnColorCss =
		btnType === ButtonType.ADD
			? 'green-button-color'
			: btnType === ButtonType.CANCEL
			? 'gray-button-color'
			: btnType === ButtonType.DELETE
			? 'red-button-color'
			: 'blue-button-color';

	return (
		<button
			type="button"
			className={`button ${btnColorCss} group`}
			disabled={disabled}
			onClick={onClick}>
			<span
				style={{
					bottom: top ? '100%' : undefined,
					top: !top ? '100%' : undefined,
					right: right ? '0%' : undefined,
					left: !right ? '0%' : undefined,
					transformOrigin: top
						? right
							? 'bottom right'
							: 'bottom left'
						: right
						? 'top right'
						: 'top left',
				}}
				className={`button-tip group-hover:group-disabled:scale-100`}>
				{t(missingPermissionMessage)}
			</span>

			{t(btnTitle)}
		</button>
	);
};

export default PermissionsButton;
