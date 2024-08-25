import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { Dialog } from '@headlessui/react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

import DeleteBottom from '../../DeleteBottom.Component';

import { useDeleteGiftCardMutation } from '../../../../../../hooks/gift-card.hooks';
import { useUserQuery } from '../../../../../../hooks/profile.hooks';

import ERRORS from '../../../../../../../constants/error.constants';

import { Permissions } from '../../../../../../../models/enums';
import GiftCard from '../../../../../../../models/Gift-Card.Model';
import User from '../../../../../../../models/User.Model';

interface DeleteGiftCardProp {
	setOpen(open: boolean): void;
	giftCard: GiftCard;
}

const DeleteGiftCard: FC<DeleteGiftCardProp> = ({ setOpen, giftCard }) => {
	const { t } = useTranslation();

	const userQuery = useUserQuery({ gettable: true, staleTime: Infinity });
	const user: User = userQuery.data;

	const deletable = user.permissions.includes(
		Permissions.PERMISSION_DELETE_GIFT_CARD
	);

	const deleteGiftCardMutation = useDeleteGiftCardMutation({});
	const onDeleteGiftCard = async (giftCardId: string, date: Date) => {
		deleteGiftCardMutation.mutate({ giftCardId, date });
	};

	const onDelete = () => {
		onDeleteGiftCard(giftCard.gift_card_id, giftCard.date);
	};

	return (
		<>
			<div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
				<div className="sm:flex sm:items-start">
					<div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
						<ExclamationTriangleIcon
							className="h-6 w-6 text-red-600"
							aria-hidden="true"
						/>
					</div>

					<div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
						<Dialog.Title
							as="h3"
							className="text-base font-semibold leading-6 text-gray-900">
							{t('Delete Gift Card')}: {giftCard.gift_card_id}
						</Dialog.Title>

						<div className="mt-2">
							{t(
								'Are you sure you want to delete this gift card? This action cannot be reversed.'
							)}
						</div>
					</div>
				</div>
			</div>

			<DeleteBottom
				onCancel={() => setOpen(false)}
				disabledDelete={!deletable}
				deleteMissingPermissionMessage={ERRORS.gift_card.permissions.delete}
				onDelete={onDelete}
			/>
		</>
	);
};

export default DeleteGiftCard;
