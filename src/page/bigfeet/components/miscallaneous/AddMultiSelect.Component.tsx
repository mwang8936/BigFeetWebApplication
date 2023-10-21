import Multiselect from 'multiselect-react-dropdown';

interface AddMultiSelectProp {
	label: string;
	id: string;
	options: { value: string | number; label: string }[];
	defaultValues: { value: string | number; label: string }[];
	onSelect(selectedList: { value: string | number; label: string }[]): void;
	placeholder: string;
}

export default function AddMultiSelect(prop: AddMultiSelectProp) {
	return (
		<div className='mb-4'>
			<label className='label' htmlFor={prop.id}>
				{prop.label}
			</label>
			<div className='flex rounded-md shadow-sm'>
				<div className='add-input' id={prop.id}>
					<Multiselect
						options={prop.options}
						selectedValues={prop.defaultValues}
						onSelect={prop.onSelect}
						onRemove={prop.onSelect}
						placeholder={prop.placeholder}
						emptyRecordMsg='No Items Found'
						displayValue='label'
						hidePlaceholder={true}
					/>
				</div>
			</div>
		</div>
	);
}
