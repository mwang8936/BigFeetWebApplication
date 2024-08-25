import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';

import DatesDisplay from '../../../miscallaneous/DatesDisplay.Component';

import EditGiftCardModal from '../../../miscallaneous/modals/scheduler/calendar/EditGiftCardModal.Component';

import GiftCard from '../../../../../../models/Gift-Card.Model';

import { moneyToString } from '../../../../../../utils/number.utils';

interface GiftCardItemProp {
	giftCard: GiftCard;
}

const GiftCardItem: FC<GiftCardItemProp> = ({ giftCard }) => {
	const { t } = useTranslation();

	const [open, setOpen] = useState(false);

	return (
		<div className="list-item-div" onClick={() => setOpen(true)}>
			<span>
				<span className="list-item-field">{t('Gift Card ID')}:</span>
				{giftCard.gift_card_id}
			</span>

			<span>
				<span className="list-item-field">{t('Payment Method')}:</span>
				{giftCard.payment_method}
			</span>

			<span>
				<span className="list-item-field">{t('Payment Amount')}:</span>$
				{moneyToString(giftCard.payment_amount)}
			</span>

			<DatesDisplay
				updatedAt={giftCard.updated_at}
				createdAt={giftCard.created_at}
			/>

			<EditGiftCardModal open={open} setOpen={setOpen} giftCard={giftCard} />
		</div>
	);
};

export default GiftCardItem;
