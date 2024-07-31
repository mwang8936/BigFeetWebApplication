import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import ModalPermissionsButton from './ModalPermissionsButton.Component';

import { ButtonType } from '../PermissionsButton.Component';

interface DeleteBottomProp {
	cancelText?: string;
	disabledCancel?: boolean;
	cancelMissingPermissionMessage?: string;
	onCancel(): void;
	deleteText?: string;
	disabledDelete?: boolean;
	deleteMissingPermissionMessage?: string;
	onDelete(): void;
}

const DeleteBottom: FC<DeleteBottomProp> = ({
	cancelText,
	disabledCancel = false,
	cancelMissingPermissionMessage = '',
	onCancel,
	deleteText,
	disabledDelete = false,
	deleteMissingPermissionMessage = '',
	onDelete,
}) => {
	const { t } = useTranslation();

	return (
		<div className="modal-bottom">
			<ModalPermissionsButton
				btnTitle={cancelText || t('Cancel')}
				btnType={ButtonType.CANCEL}
				disabled={disabledCancel}
				missingPermissionMessage={cancelMissingPermissionMessage}
				onClick={onCancel}
			/>

			<ModalPermissionsButton
				btnTitle={deleteText || t('Delete')}
				btnType={ButtonType.DELETE}
				disabled={disabledDelete}
				missingPermissionMessage={deleteMissingPermissionMessage}
				onClick={onDelete}
			/>
		</div>
	);
};

export default DeleteBottom;
