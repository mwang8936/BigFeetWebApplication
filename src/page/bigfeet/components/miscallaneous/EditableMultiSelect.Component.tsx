import { useEffect, useState } from 'react';
import Multiselect from 'multiselect-react-dropdown';

interface EditableMultiSelectProp {
	label: string;
	id: string;
	options: { value: string | number; label: string }[];
	selectedValues: { value: string | number; label: string }[];
	onSelect(selectedList: { value: string | number; label: string }[]): void;
	placeholder: string;
	editable: boolean;
	missingPermissionMessage: string;
}

export default function EditableMultiSelect(prop: EditableMultiSelectProp) {
	const [disabled, setDisabled] = useState(true);

	useEffect(() => {
		setDisabled(true);
		prop.onSelect(prop.selectedValues);
	}, [JSON.stringify(prop.selectedValues)]);

	const disabledOptions = prop.selectedValues.map((option) => ({
		value: option.value,
		label: ` ${option.label} `,
	}));

	return (
		<div className='mb-4'>
			<label className='label' htmlFor={prop.id}>
				{prop.label}
			</label>
			<div className='flex rounded-md shadow-sm'>
				<div className='editable-input' id={prop.id}>
					<Multiselect
						options={prop.options}
						selectedValues={
							disabled ? disabledOptions : prop.selectedValues
						}
						onSelect={prop.onSelect}
						onRemove={prop.onSelect}
						placeholder={prop.placeholder}
						emptyRecordMsg='No Items Found'
						displayValue='label'
						hidePlaceholder={true}
						disable={disabled}
					/>
				</div>
				<button
					type='button'
					className='button ms-3 group'
					disabled={!prop.editable}
					onClick={() => {
						if (!disabled) {
							prop.onSelect(prop.selectedValues);
						}
						setDisabled(!disabled);
					}}
				>
					{disabled ? 'Change' : 'Cancel'}
					<span className='button-tip group-hover:group-disabled:scale-100'>
						{prop.missingPermissionMessage}
					</span>
				</button>
			</div>
		</div>
	);
}
