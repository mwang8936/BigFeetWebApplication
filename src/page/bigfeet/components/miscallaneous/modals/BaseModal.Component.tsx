import { FC, Fragment } from 'react';

import { Dialog, Transition } from '@headlessui/react';

interface BaseModalProp {
	open: boolean;
	setOpen(open: boolean): void;
	onOutsideTouchCancel?(open: boolean): void;
	contentElement: React.ReactNode;
	defaultButtonRef?: React.RefObject<null>;
}

const BaseModal: FC<BaseModalProp> = ({
	open,
	setOpen,
	onOutsideTouchCancel,
	contentElement,
	defaultButtonRef,
}) => {
	return (
		<Transition.Root show={open} as={Fragment}>
			<Dialog
				as="div"
				className="relative z-10"
				initialFocus={defaultButtonRef}
				onClose={(open: boolean) => {
					setOpen(open);
					if (onOutsideTouchCancel) {
						onOutsideTouchCancel(open);
					}
				}}>
				<Transition.Child
					as={Fragment}
					enter="ease-out duration-300"
					enterFrom="opacity-0"
					enterTo="opacity-100"
					leave="ease-in duration-200"
					leaveFrom="opacity-100"
					leaveTo="opacity-0">
					<div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
				</Transition.Child>

				<div className="fixed inset-0 z-10 overflow-y-auto">
					<Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />

					<div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
						<Transition.Child
							as={Fragment}
							enter="ease-out duration-300"
							enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
							enterTo="opacity-100 translate-y-0 sm:scale-100"
							leave="ease-in duration-200"
							leaveFrom="opacity-100 translate-y-0 sm:scale-100"
							leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
							<Dialog.Panel className="relative transform overflow-visible rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
								{contentElement}
							</Dialog.Panel>
						</Transition.Child>
					</div>
				</div>
			</Dialog>
		</Transition.Root>
	);
};

export default BaseModal;
