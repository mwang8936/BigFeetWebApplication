import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Dialog } from '@headlessui/react';
import { PencilSquareIcon } from '@heroicons/react/24/outline';

import AddGiftCardModal from './AddGiftCardModal.Component';

import AddBottom from '../../AddBottom.Component';

import GiftCardItem from '../../../../scheduler/Calendar/components/GiftCardItem.Component';

import { useUserQuery } from '../../../../../../hooks/profile.hooks';

import ERRORS from '../../../../../../../constants/error.constants';

import { Permissions } from '../../../../../../../models/enums';
import GiftCard from '../../../../../../../models/Gift-Card.Model';
import User from '../../../../../../../models/User.Model';

interface GiftCardProp {
	setOpen(open: boolean): void;
	giftCards: GiftCard[];
}

const GiftCards: FC<GiftCardProp> = ({ setOpen, giftCards }) => {
	const { t } = useTranslation();

	const [openAddGiftCardModal, setOpenAddGiftCardModal] =
		useState<boolean>(false);

	const userQuery = useUserQuery({ gettable: true, staleTime: Infinity });
	const user: User = userQuery.data;

	const creatable = user.permissions.includes(
		Permissions.PERMISSION_ADD_GIFT_CARD
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
							{t('Gift Cards')}
						</Dialog.Title>

						<div className="list-div">
							{giftCards.length !== 0 ? (
								giftCards.map((giftCard) => (
									<GiftCardItem
										key={giftCard.gift_card_id}
										giftCard={giftCard}
									/>
								))
							) : (
								<h1 className="large-centered-text">
									{t('No Gift Cards Created')}
								</h1>
							)}
						</div>
					</div>
				</div>
			</div>

			<AddBottom
				onCancel={() => setOpen(false)}
				disabledAdd={!creatable}
				addMissingPermissionMessage={ERRORS.gift_card.permissions.add}
				onAdd={() => setOpenAddGiftCardModal(true)}
			/>

			<AddGiftCardModal
				open={openAddGiftCardModal}
				setOpen={setOpenAddGiftCardModal}
			/>
		</>
	);
};

export default GiftCards;
