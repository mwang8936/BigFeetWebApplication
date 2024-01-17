import { FC, Fragment, useEffect, useState } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import PermissionsButton from '../PermissionsButton.Component';
import { useTranslation } from 'react-i18next';

export interface DropDownItem {
	id: number | string | null;
	name: string;
	avatar?: string;
}

interface ValidationProp {
	required: boolean;
	requiredMessage?: string;
}

interface EditableDropDownProp {
	originalOption: DropDownItem;
	option: DropDownItem;
	options: DropDownItem[];
	setOption(item: DropDownItem): void;
	label: string;
	validationProp: ValidationProp;
	editable: boolean;
	missingPermissionMessage: string;
}

function classNames(...classes: any[]) {
	return classes.filter(Boolean).join(' ');
}

const EditableDropDown: FC<EditableDropDownProp> = ({
	originalOption,
	option,
	options,
	setOption,
	label,
	validationProp,
	editable,
	missingPermissionMessage,
}) => {
	const { t } = useTranslation();

	const [disabled, setDisabled] = useState(true);

	useEffect(() => {
		setDisabled(true);
	}, [originalOption]);

	const handleDisableBtnClick = () => {
		if (!disabled) {
			setOption(originalOption);
		}
		setDisabled(!disabled);
	};

	return (
		<div className="mb-4">
			<Listbox value={option} onChange={setOption} disabled={disabled}>
				{({ open }) => (
					<>
						<Listbox.Label className="label">{label}</Listbox.Label>
						<div className="flex relative rounded-md shadow-sm">
							<Listbox.Button className="editable-input">
								<span className="flex items-center">
									{option.avatar && (
										<img
											src={option.avatar}
											alt=""
											className="h-5 w-5 flex-shrink-0 rounded-full"
										/>
									)}
									<span className="ml-3 block truncate">{option.name}</span>
								</span>
								<span className="pointer-events-none absolute inset-y-0 right-[95px] ml-3 flex items-center pr-2">
									<ChevronUpDownIcon
										className="h-5 w-5 text-gray-400"
										aria-hidden="true"
									/>
								</span>
							</Listbox.Button>

							<Transition
								show={open}
								as={Fragment}
								leave="transition ease-in duration-100"
								leaveFrom="opacity-100"
								leaveTo="opacity-0">
								<Listbox.Options className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
									{options.map((option) => (
										<Listbox.Option
											key={option.id}
											className={({ active }) =>
												classNames(
													active ? 'bg-sky-500 text-white' : 'text-gray-900',
													'relative cursor-default select-none py-2 pl-3 pr-9'
												)
											}
											value={option}>
											{({ selected, active }) => (
												<>
													<div className="flex items-center">
														{option.avatar && (
															<img
																src={option.avatar}
																alt=""
																className="h-5 w-5 flex-shrink-0 rounded-full"
															/>
														)}
														<span
															className={classNames(
																selected ? 'font-semibold' : 'font-normal',
																'ml-3 block truncate'
															)}>
															{option.name}
														</span>
													</div>

													{selected && (
														<span
															className={classNames(
																active ? 'text-white' : 'text-sky-500',
																'absolute inset-y-0 right-0 flex items-center pr-4'
															)}>
															<CheckIcon
																className="h-5 w-5"
																aria-hidden="true"
															/>
														</span>
													)}
												</>
											)}
										</Listbox.Option>
									))}
								</Listbox.Options>
							</Transition>
							<div className="ms-3">
								<PermissionsButton
									btnTitle={disabled ? t('Change') : t('Cancel')}
									disabled={!editable}
									missingPermissionMessage={missingPermissionMessage}
									onClick={handleDisableBtnClick}
								/>
							</div>
						</div>
						{validationProp.required && option.id == null && (
							<p className="error-label">{validationProp.requiredMessage}</p>
						)}
					</>
				)}
			</Listbox>
		</div>
	);
};

export default EditableDropDown;
