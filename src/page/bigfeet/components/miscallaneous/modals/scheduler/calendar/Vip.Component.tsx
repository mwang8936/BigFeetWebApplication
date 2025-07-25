import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Dialog } from '@headlessui/react';

import { PencilSquareIcon } from '@heroicons/react/24/outline';

import AddVipModal from './AddVipModal.Component';

import AddBottom from '../../AddBottom.Component';

import { useUserQuery } from '../../../../../../hooks/profile.hooks';

import VipItem from '../../../../scheduler/Calendar/components/VipItem.Component';

import ERRORS from '../../../../../../../constants/error.constants';

import { Permissions } from '../../../../../../../models/enums';
import User from '../../../../../../../models/User.Model';
import VipPackage from '../../../../../../../models/Vip-Package.Model';

interface VipsProp {
	setOpen(open: boolean): void;
	defaultEmployeeId?: number;
	vipPackages: VipPackage[];
}

const Vips: FC<VipsProp> = ({ setOpen, defaultEmployeeId, vipPackages }) => {
	const { t } = useTranslation();

	const [openAddVipPackageModal, setOpenAddVipPackageModal] =
		useState<boolean>(false);

	const userQuery = useUserQuery({ gettable: true, staleTime: Infinity });
	const user: User = userQuery.data;

	const creatable = user.permissions.includes(
		Permissions.PERMISSION_ADD_VIP_PACKAGE
	);

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

						<div className="list-div">
							{vipPackages.length !== 0 ? (
								vipPackages.map((vipPackage) => (
									<VipItem key={vipPackage.serial} vipPackage={vipPackage} />
								))
							) : (
								<h1 className="large-centered-text">
									{t('No Vip Packages Created')}
								</h1>
							)}
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
				defaultEmployeeId={defaultEmployeeId}
			/>
		</>
	);
};

export default Vips;
