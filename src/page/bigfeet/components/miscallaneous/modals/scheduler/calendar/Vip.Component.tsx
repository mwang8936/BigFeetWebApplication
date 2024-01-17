import { FC } from 'react';
import { PencilSquareIcon } from '@heroicons/react/24/outline';
import { Dialog } from '@headlessui/react';
import VipPackage from '../../../../../../../models/Vip-Package.Model';
import {
	AddVipPackageRequest,
	UpdateVipPackageRequest,
} from '../../../../../../../models/requests/Vip-Package.Request.Model';

interface VipProp {
	setOpen(open: boolean): void;
	vipPackages: VipPackage[];
	date: Date;
	creatable: boolean;
	onAddVipPackage(request: AddVipPackageRequest): Promise<void>;
	editable: boolean;
	onEditVipPakcage(
		serial: number,
		request: UpdateVipPackageRequest
	): Promise<void>;
	deletable: boolean;
	onDeleteVipPackage(serial: number): Promise<void>;
}

const Vip: FC<VipProp> = ({
	setOpen,
	vipPackages,
	date,
	creatable,
	onAddVipPackage,
	editable,
	onEditVipPakcage,
	deletable,
	onDeleteVipPackage,
}) => {
	return (
		<>
			<div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
				<div className="sm:flex sm:items-start">
					<div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
						<PencilSquareIcon
							className="h-6 w-6 text-blue-600"
							aria-hidden="true"
						/>
					</div>
					<div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
						<Dialog.Title
							as="h3"
							className="text-base font-semibold leading-6 text-gray-900">
							Vip Packages
						</Dialog.Title>
						<div className="mt-2">TEST</div>
					</div>
				</div>
			</div>
			<div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
				<button
					type="submit"
					className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto disabled:bg-blue-300 disabled:cursor-not-allowed">
					Sign
				</button>
				<button
					type="button"
					className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
					onClick={() => {
						setOpen(false);
					}}>
					Cancel
				</button>
			</div>
		</>
	);
};

export default Vip;
