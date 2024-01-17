import { FC } from 'react';
import ModalPermissionsButton from './ModalPermissionsButton.Component';
import { ButtonType } from '../PermissionsButton.Component';
import { useTranslation } from 'react-i18next';

interface EditBottomProp {
	cancelText?: string;
	disabledCancel?: boolean;
	cancelMissingPermissionMessage?: string;
	onCancel(): void;
	editText?: string;
	disabledEdit?: boolean;
	editMissingPermissionMessage?: string;
	onEdit(): void;
	deleteText?: string;
	disabledDelete?: boolean;
	deleteMissingPermissionMessage?: string;
	onDelete?(): void;
}

const EditBottom: FC<EditBottomProp> = ({
	cancelText,
	disabledCancel = false,
	cancelMissingPermissionMessage = '',
	onCancel,
	editText,
	disabledEdit = false,
	editMissingPermissionMessage = '',
	onEdit,
	deleteText,
	disabledDelete = false,
	deleteMissingPermissionMessage = '',
	onDelete,
}) => {
	const { t } = useTranslation();

	return (
		<div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
			<ModalPermissionsButton
				btnTitle={editText || t('Edit')}
				disabled={disabledEdit}
				missingPermissionMessage={editMissingPermissionMessage}
				onClick={onEdit}
			/>
			<ModalPermissionsButton
				btnTitle={cancelText || t('Cancel')}
				btnType={ButtonType.CANCEL}
				disabled={disabledCancel}
				missingPermissionMessage={cancelMissingPermissionMessage}
				onClick={onCancel}
			/>

			{onDelete && (
				<div className="me-auto">
					<ModalPermissionsButton
						btnTitle={deleteText || t('Delete')}
						btnType={ButtonType.DELETE}
						right={false}
						disabled={disabledDelete}
						missingPermissionMessage={deleteMissingPermissionMessage}
						onClick={onDelete}
					/>
				</div>
			)}
		</div>
	);
};

export default EditBottom;
