import { FC } from 'react';

import GiftCards from './GiftCard.Component';

import BaseModal from '../../BaseModal.Component';

import GiftCard from '../../../../../../../models/Gift-Card.Model';

interface GiftCardsModalProp {
	open: boolean;
	setOpen(open: boolean): void;
	giftCards: GiftCard[];
}

const GiftCardsModal: FC<GiftCardsModalProp> = ({
	open,
	setOpen,
	giftCards,
}) => {
	return (
		<BaseModal
			open={open}
			setOpen={setOpen}
			contentElement={<GiftCards setOpen={setOpen} giftCards={giftCards} />}
		/>
	);
};

export default GiftCardsModal;
