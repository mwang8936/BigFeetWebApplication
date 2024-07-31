import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import ModalPermissionsButton from './ModalPermissionsButton.Component';

import { ButtonType } from '../PermissionsButton.Component';

interface AddBottomProp {
	cancelText?: string;
	disabledCancel?: boolean;
	cancelMissingPermissionMessage?: string;
	onCancel(): void;
	addText?: string;
	disabledAdd?: boolean;
	addMissingPermissionMessage?: string;
	onAdd(): void;
	editText?: string;
	disabledEdit?: boolean;
	editMissingPermissionMessage?: string;
	onEdit?(): void;
}

const AddBottom: FC<AddBottomProp> = ({
	cancelText,
	disabledCancel = false,
	cancelMissingPermissionMessage = '',
	onCancel,
	addText,
	disabledAdd = false,
	addMissingPermissionMessage = '',
	onAdd,
	editText,
	disabledEdit = false,
	editMissingPermissionMessage = '',
	onEdit,
}) => {
	const { t } = useTranslation();

	return (
		<div className="modal-bottom">
			<ModalPermissionsButton
				btnTitle={addText || t('Add')}
				btnType={ButtonType.ADD}
				disabled={disabledAdd}
				missingPermissionMessage={addMissingPermissionMessage}
				onClick={onAdd}
			/>

			<ModalPermissionsButton
				btnTitle={cancelText || t('Cancel')}
				btnType={ButtonType.CANCEL}
				disabled={disabledCancel}
				missingPermissionMessage={cancelMissingPermissionMessage}
				onClick={onCancel}
			/>

			{onEdit && (
				<div className="me-auto">
					<ModalPermissionsButton
						btnTitle={editText || t('Edit')}
						right={false}
						disabled={disabledEdit}
						missingPermissionMessage={editMissingPermissionMessage}
						onClick={onEdit}
					/>
				</div>
			)}
		</div>
	);
};

export default AddBottom;
