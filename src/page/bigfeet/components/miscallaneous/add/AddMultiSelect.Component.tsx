import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import Multiselect from 'multiselect-react-dropdown';

interface AddMultiSelectProp {
	options: { value: string | number; label: string }[];
	values: { value: string | number; label: string }[];
	setValues(selectedList: { value: string | number; label: string }[]): void;
	label: string;
	name: string;
	placeholder: string;
}

const AddMultiSelect: FC<AddMultiSelectProp> = ({
	options,
	values,
	setValues,
	label,
	name,
	placeholder,
}) => {
	const { t } = useTranslation();

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
						placeholder={placeholder}
						emptyRecordMsg={t('No Items Found')}
						displayValue="label"
						hidePlaceholder={true}
					/>
				</div>
			</div>
		</div>
	);
};

export default AddMultiSelect;
