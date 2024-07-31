import { FC, Fragment, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Listbox, Transition } from '@headlessui/react';

import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';

import PermissionsButton from '../PermissionsButton.Component';

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

	const [disabled, setDisabled] = useState(originalOption.id !== null);

	useEffect(() => {
		setDisabled(originalOption.id !== null);
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
						<Listbox.Label className="label">{t(label)}</Listbox.Label>

						<div className="div-input">
							<Listbox.Button className="editable-input">
								<span className="flex items-center">
									{option.avatar && (
										<img
											src={option.avatar}
											alt=""
											className="drop-down-icon"
										/>
									)}
									<span className="drop-down-span">{t(option.name)}</span>
								</span>

								<span className="drop-down-chevron">
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
								<Listbox.Options className="list-box">
									{options.map((option) => (
										<Listbox.Option
											key={option.id}
											className={({ active }) =>
												classNames(
													active ? 'bg-sky-500 text-white' : 'text-gray-900',
													'list-box-active'
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
																className="drop-down-icon"
															/>
														)}

														<span
															className={classNames(
																selected ? 'font-semibold' : 'font-normal',
																'drop-down-span'
															)}>
															{t(option.name)}
														</span>
													</div>

													{selected && (
														<span
															className={classNames(
																active ? 'text-white' : 'text-sky-500',
																'list-box-selected'
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
									missingPermissionMessage={t(missingPermissionMessage)}
									onClick={handleDisableBtnClick}
								/>
							</div>
						</div>

						{validationProp.required && option.id == null && (
							<p className="error-label">
								{validationProp.requiredMessage &&
									t(validationProp.requiredMessage)}
							</p>
						)}
					</>
				)}
			</Listbox>
		</div>
	);
};

export default EditableDropDown;
