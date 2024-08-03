import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import VipPackage from '../../../../../../models/Vip-Package.Model';
import { UpdateVipPackageRequest } from '../../../../../../models/requests/Vip-Package.Request.Model';
import EditVipModal from '../../../miscallaneous/modals/scheduler/calendar/EditVipModal.Component';
import { moneyToString } from '../../../../../../utils/number.utils';
import { Permissions, Role } from '../../../../../../models/enums';
import Employee from '../../../../../../models/Employee.Model';
import User from '../../../../../../models/User.Model';
import { useEmployeesQuery } from '../../../../../hooks/employee.hooks';
import { useUserQuery } from '../../../../../hooks/profile.hooks';
import GiftCard from '../../../../../../models/Gift-Card.Model';
import { UpdateGiftCardRequest } from '../../../../../../models/requests/GIft-Card.Request';
import DatesDisplay from '../../../miscallaneous/DatesDisplay.Component';
import EditGiftCard from '../../../miscallaneous/modals/scheduler/calendar/EditGiftCard.Component';
import EditGiftCardModal from '../../../miscallaneous/modals/scheduler/calendar/EditGiftCardModal.Component';

interface GiftCardItemProp {
	giftCard: GiftCard;
	editable: boolean;
	onEditGiftCard(
		giftCardId: string,
		request: UpdateGiftCardRequest
	): Promise<void>;
	deletable: boolean;
	onDeleteGiftCard(giftCardId: string): Promise<void>;
}

const GiftCardItem: FC<GiftCardItemProp> = ({
	giftCard,
	editable,
	onEditGiftCard,
	deletable,
	onDeleteGiftCard,
}) => {
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

			<EditGiftCardModal
				open={open}
				setOpen={setOpen}
				giftCard={giftCard}
				editable={editable}
				onEditGiftCard={onEditGiftCard}
				deletable={deletable}
				onDeleteGiftCard={onDeleteGiftCard}
			/>
		</div>
	);
};

export default GiftCardItem;
