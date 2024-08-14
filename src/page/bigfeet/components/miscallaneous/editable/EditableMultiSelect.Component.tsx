import { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import Multiselect from 'multiselect-react-dropdown';

import PermissionsButton from '../PermissionsButton.Component';

interface EditableMultiSelectProp {
	originalValues: { value: string | number; label: string }[];
	options: { value: string | number; label: string }[];
	values: { value: string | number; label: string }[];
	setValues(selectedList: { value: string | number; label: string }[]): void;
	label: string;
	name: string;
	placeholder: string;
	editable: boolean;
	missingPermissionMessage: string;
}

const EditableMultiSelect: FC<EditableMultiSelectProp> = ({
	originalValues,
	options,
	values,
	setValues,
	label,
	name,
	placeholder,
	editable,
	missingPermissionMessage,
}) => {
	const { t } = useTranslation();

	const [disabled, setDisabled] = useState(true);

	useEffect(() => {
		setDisabled(true);
	}, [JSON.stringify(originalValues)]);

	const handleDisableBtnClick = () => {
		if (!disabled) {
			setValues(originalValues);
		}
		setDisabled(!disabled);
	};

	return (
		<div className="mb-4">
			<label className="label" htmlFor={name}>
				{t(label)}
			</label>

			<div className="input-div">
				<div className="editable-input" id={name}>
					<Multiselect
						options={options}
						selectedValues={values}
						onSelect={setValues}
						onRemove={setValues}
						placeholder={t(placeholder)}
						emptyRecordMsg={t('No Items Found')}
						displayValue="label"
						hidePlaceholder={true}
						disable={disabled}
					/>
				</div>

				<div className="ms-3">
					<PermissionsButton
						btnTitle={disabled ? 'Change' : 'Cancel'}
						disabled={!editable}
						missingPermissionMessage={missingPermissionMessage}
						onClick={handleDisableBtnClick}
					/>
				</div>
			</div>
		</div>
	);
};

export default EditableMultiSelect;
