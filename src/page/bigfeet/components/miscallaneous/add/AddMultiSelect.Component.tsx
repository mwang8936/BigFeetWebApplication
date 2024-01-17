import { FC } from 'react';
import Multiselect from 'multiselect-react-dropdown';
import { useTranslation } from 'react-i18next';

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
				{label}
			</label>
			<div className="flex rounded-md shadow-sm">
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
