import { Fragment, useEffect, useState } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import { DropDownItem } from './EditableDropDown.Component';

interface AddDropDownProp {
	default: DropDownItem;
	options: DropDownItem[];
	onSelect(item: DropDownItem): void;
	label: string;
	required: boolean;
	requiredMessage?: string;
}

function classNames(...classes: any[]) {
	return classes.filter(Boolean).join(' ');
}

export default function AddDropDown(prop: AddDropDownProp) {
	const [selected, setSelected] = useState<DropDownItem>(prop.default);

	const onSelect = (option: DropDownItem) => {
		setSelected(option);
		prop.onSelect(option);
	};

	useEffect(() => {
		setSelected(prop.default);
	}, [JSON.stringify(prop.default)]);

	return (
		<div className='mb-4'>
			<Listbox value={selected} onChange={onSelect}>
				{({ open }) => (
					<>
						<Listbox.Label className='label'>
							{prop.label}
						</Listbox.Label>
						<div className='flex relative rounded-md shadow-sm'>
							<Listbox.Button className='add-input'>
								<span className='flex items-center'>
									{selected.avatar && (
										<img
											src={selected.avatar}
											alt=''
											className='h-5 w-5 flex-shrink-0 rounded-full'
										/>
									)}
									<span className='ml-3 block truncate'>
										{selected.name}
									</span>
								</span>
								<span className='pointer-events-none absolute inset-y-0 right-[0%] ml-3 flex items-center pr-2'>
									<ChevronUpDownIcon
										className='h-5 w-5 text-gray-400'
										aria-hidden='true'
									/>
								</span>
							</Listbox.Button>

							<Transition
								show={open}
								as={Fragment}
								leave='transition ease-in duration-100'
								leaveFrom='opacity-100'
								leaveTo='opacity-0'
							>
								<Listbox.Options className='absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm'>
									{prop.options.map((option) => (
										<Listbox.Option
											key={option.id}
											className={({ active }) =>
												classNames(
													active
														? 'bg-sky-500 text-white'
														: 'text-gray-900',
													'relative cursor-default select-none py-2 pl-3 pr-9'
												)
											}
											value={option}
										>
											{({ selected, active }) => (
												<>
													<div className='flex items-center'>
														{option.avatar && (
															<img
																src={
																	option.avatar
																}
																alt=''
																className='h-5 w-5 flex-shrink-0 rounded-full'
															/>
														)}
														<span
															className={classNames(
																selected
																	? 'font-semibold'
																	: 'font-normal',
																'ml-3 block truncate'
															)}
														>
															{option.name}
														</span>
													</div>

													{selected && (
														<span
															className={classNames(
																active
																	? 'text-white'
																	: 'text-sky-500',
																'absolute inset-y-0 right-0 flex items-center pr-4'
															)}
														>
															<CheckIcon
																className='h-5 w-5'
																aria-hidden='true'
															/>
														</span>
													)}
												</>
											)}
										</Listbox.Option>
									))}
								</Listbox.Options>
							</Transition>
						</div>
						{prop.required && selected.id == null && (
							<p className='error-label'>
								{prop.requiredMessage}
							</p>
						)}
					</>
				)}
			</Listbox>
		</div>
	);
}
