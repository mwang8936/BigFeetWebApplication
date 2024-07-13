import { FC, useState } from 'react';
import { PencilSquareIcon } from '@heroicons/react/24/outline';
import { Dialog } from '@headlessui/react';
import VipPackage from '../../../../../../../models/Vip-Package.Model';
import {
	AddVipPackageRequest,
	UpdateVipPackageRequest,
} from '../../../../../../../models/requests/Vip-Package.Request.Model';
import AddBottom from '../../AddBottom.Component';
import ERRORS from '../../../../../../../constants/error.constants';
import { useTranslation } from 'react-i18next';
import AddVipModal from './AddVipModal.Component';
import VipItem from '../../../../scheduler/Calendar/components/VipItem.Component';

interface VipProp {
	setOpen(open: boolean): void;
	vipPackages: VipPackage[];
	creatable: boolean;
	onAddVipPackage(request: AddVipPackageRequest): Promise<void>;
	editable: boolean;
	onEditVipPackage(
		serial: string,
		request: UpdateVipPackageRequest
	): Promise<void>;
	deletable: boolean;
	onDeleteVipPackage(serial: string): Promise<void>;
}

const Vip: FC<VipProp> = ({
	setOpen,
	vipPackages,
	creatable,
	onAddVipPackage,
	editable,
	onEditVipPackage,
	deletable,
	onDeleteVipPackage,
}) => {
	const { t } = useTranslation();

	const [openAddVipPackageModal, setOpenAddVipPackageModal] =
		useState<boolean>(false);

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
							{t('Vip Packages')}
						</Dialog.Title>
						<div className="mt-2">
							{vipPackages.map((vipPackage) => (
								<VipItem
									key={vipPackage.serial}
									vipPackage={vipPackage}
									editable={editable}
									onEditVipPackage={onEditVipPackage}
									deletable={deletable}
									onDeleteVipPackage={onDeleteVipPackage}
								/>
							))}
						</div>
					</div>
				</div>
			</div>
			<AddBottom
				onCancel={() => setOpen(false)}
				disabledAdd={!creatable}
				addMissingPermissionMessage={ERRORS.vip_package.permissions.add}
				onAdd={() => setOpenAddVipPackageModal(true)}
			/>
			<AddVipModal
				open={openAddVipPackageModal}
				setOpen={setOpenAddVipPackageModal}
				creatable={creatable}
				onAddVipPackage={onAddVipPackage}
			/>
		</>
	);
};

export default Vip;
