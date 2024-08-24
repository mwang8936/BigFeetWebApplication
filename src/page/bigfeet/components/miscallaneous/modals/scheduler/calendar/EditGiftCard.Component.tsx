import { FC, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { Dialog } from '@headlessui/react';
import { PencilSquareIcon } from '@heroicons/react/24/outline';

import DeleteGiftCardModal from './DeleteGiftCardModal.Component';

import EditBottom from '../../EditBottom.Component';

import EditableDate from '../../../editable/EditableDate.Component';
import EditableDropDown from '../../../editable/EditableDropDown.Component';
import EditablePayRate from '../../../editable/EditablePayRate.Component';

import { useUpdateGiftCardMutation } from '../../../../../../hooks/gift-card.hooks';
import { useUserQuery } from '../../../../../../hooks/profile.hooks';

import { paymentMethodDropDownItems } from '../../../../../../../constants/drop-down.constants';
import ERRORS from '../../../../../../../constants/error.constants';
import LABELS from '../../../../../../../constants/label.constants';
import NAMES from '../../../../../../../constants/name.constants';
import NUMBERS from '../../../../../../../constants/numbers.constants';
import PLACEHOLDERS from '../../../../../../../constants/placeholder.constants';

import { PaymentMethod, Permissions } from '../../../../../../../models/enums';
import GiftCard from '../../../../../../../models/Gift-Card.Model';
import User from '../../../../../../../models/User.Model';

import { UpdateGiftCardRequest } from '../../../../../../../models/requests/Gift-Card.Request';

import { sameDate } from '../../../../../../../utils/date.utils';

interface EditGiftCardProp {
	setOpen(open: boolean): void;
	giftCard: GiftCard;
}

const EditGiftCard: FC<EditGiftCardProp> = ({ setOpen, giftCard }) => {
	const { t } = useTranslation();

	const [openDeleteModal, setOpenDeleteModal] = useState(false);

	const [dateInput, setDateInput] = useState<Date | null>(giftCard.date);
	const [paymentMethodInput, setPaymentMethodInput] =
		useState<PaymentMethod | null>(giftCard.payment_method);
	const [paymentAmountInput, setPaymentAmountInput] = useState<number | null>(
		giftCard.payment_amount
	);

	const [invalidDate, setInvalidDate] = useState<boolean>(false);
	const [invalidPaymentAmount, setInvalidPaymentAmount] =
		useState<boolean>(false);

	const [changesMade, setChangesMade] = useState<boolean>(false);
	const [missingRequiredInput, setMissingRequiredInput] =
		useState<boolean>(false);
	const [invalidInput, setInvalidInput] = useState<boolean>(false);

	const userQuery = useUserQuery({ gettable: true, staleTime: Infinity });
	const user: User = userQuery.data;

	const editable = user.permissions.includes(
		Permissions.PERMISSION_UPDATE_GIFT_CARD
	);
	const deletable = user.permissions.includes(
		Permissions.PERMISSION_DELETE_GIFT_CARD
	);

	useEffect(() => {
		const date: Date | null | undefined =
			dateInput === null
				? null
				: sameDate(dateInput, giftCard.date)
				? undefined
				: dateInput;
		const payment_method: PaymentMethod | null | undefined =
			paymentMethodInput === giftCard.payment_method
				? undefined
				: paymentMethodInput;
		const payment_amount: number | null | undefined =
			paymentAmountInput === giftCard.payment_amount
				? undefined
				: paymentAmountInput;

		const changesMade =
			date !== undefined ||
			payment_method !== undefined ||
			payment_amount !== undefined;

		setChangesMade(changesMade);

		const missingRequiredInput =
			date === null || payment_method === null || payment_amount === null;

		setMissingRequiredInput(missingRequiredInput);
	}, [dateInput, paymentMethodInput, paymentAmountInput]);

	useEffect(() => {
		const invalidInput = invalidDate || invalidPaymentAmount;
		setInvalidInput(invalidInput);
	}, [invalidDate, invalidPaymentAmount]);

	const updateGiftCardMutation = useUpdateGiftCardMutation({
		onSuccess: () => setOpen(false),
	});
	const onEditGiftCard = async (
		giftCardId: string,
		request: UpdateGiftCardRequest,
		originalDate: Date,
		newDate?: Date
	) => {
		updateGiftCardMutation.mutate({
			giftCardId,
			request,
			originalDate,
			newDate,
		});
	};

	const onEdit = () => {
		const date: Date | undefined =
			dateInput !== null && sameDate(dateInput, giftCard.date)
				? undefined
				: (dateInput as Date);
		const payment_method: PaymentMethod | undefined =
			paymentMethodInput === giftCard.payment_method
				? undefined
				: (paymentMethodInput as PaymentMethod);
		const payment_amount: number | undefined =
			paymentAmountInput === giftCard.payment_amount
				? undefined
				: (paymentAmountInput as number);

		const editGiftCardRequest: UpdateGiftCardRequest = {
			...(date !== undefined && { date }),
			...(payment_method !== undefined && { payment_method }),
			...(payment_amount !== undefined && { payment_amount }),
		};

		onEditGiftCard(
			giftCard.gift_card_id,
			editGiftCardRequest,
			giftCard.date,
			date
		);
	};

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
							{t('Edit Gift Card')}: {giftCard.gift_card_id}
						</Dialog.Title>

						<div className="mt-2">
							<EditableDate
								originalDate={giftCard.date}
								date={dateInput}
								setDate={setDateInput}
								label={LABELS.gift_card.date}
								validationProp={{
									minDate: undefined,
									maxDate: undefined,
									required: true,
									requiredMessage: ERRORS.gift_card.date.required,
									invalid: invalidDate,
									setInvalid: setInvalidDate,
									invalidMessage: ERRORS.gift_card.date.invalid,
								}}
								editable={editable}
								missingPermissionMessage={ERRORS.gift_card.permissions.edit}
							/>

							<EditableDropDown
								originalOption={
									paymentMethodDropDownItems[
										paymentMethodDropDownItems.findIndex(
											(option) => option.id === giftCard.payment_method
										) || 0
									]
								}
								option={
									paymentMethodDropDownItems[
										paymentMethodDropDownItems.findIndex(
											(option) => option.id === paymentMethodInput
										) || 0
									]
								}
								options={paymentMethodDropDownItems}
								setOption={(option) => {
									setPaymentMethodInput(option.id as PaymentMethod | null);
								}}
								label={LABELS.gift_card.payment_method}
								validationProp={{
									required: true,
									requiredMessage: ERRORS.gift_card.payment_method.required,
								}}
								editable={editable}
								missingPermissionMessage={ERRORS.gift_card.permissions.edit}
							/>

							<EditablePayRate
								originalAmount={giftCard.payment_amount}
								amount={paymentAmountInput}
								setAmount={setPaymentAmountInput}
								label={LABELS.gift_card.payment_amount}
								name={NAMES.gift_card.payment_amount}
								validationProp={{
									max: NUMBERS.gift_card.payment_amount,
									required: true,
									requiredMessage: ERRORS.gift_card.payment_amount.required,
									invalid: invalidPaymentAmount,
									setInvalid: setInvalidPaymentAmount,
									invalidMessage: ERRORS.gift_card.payment_amount.invalid,
								}}
								placeholder={PLACEHOLDERS.gift_card.payment_amount}
								editable={editable}
								missingPermissionMessage={ERRORS.gift_card.permissions.edit}
							/>
						</div>
					</div>
				</div>
			</div>

			<EditBottom
				onCancel={() => setOpen(false)}
				disabledEdit={
					!editable || !changesMade || missingRequiredInput || invalidInput
				}
				editMissingPermissionMessage={
					!editable
						? ERRORS.gift_card.permissions.edit
						: !changesMade
						? ERRORS.no_changes
						: missingRequiredInput
						? ERRORS.required
						: invalidInput
						? ERRORS.invalid
						: ''
				}
				onEdit={onEdit}
				disabledDelete={!deletable}
				deleteMissingPermissionMessage={ERRORS.gift_card.permissions.delete}
				onDelete={() => setOpenDeleteModal(true)}
			/>

			<DeleteGiftCardModal
				open={openDeleteModal}
				setOpen={setOpenDeleteModal}
				giftCard={giftCard}
			/>
		</>
	);
};

export default EditGiftCard;
