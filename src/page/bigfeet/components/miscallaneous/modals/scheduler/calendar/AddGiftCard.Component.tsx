import { FC, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { Dialog } from '@headlessui/react';
import { PlusCircleIcon } from '@heroicons/react/24/outline';

import AddBottom from '../../AddBottom.Component';

import AddInput from '../../../add/AddInput.Component';
import AddDate from '../../../add/AddDate.Component';
import AddDropDown from '../../../add/AddDropDown.Component';
import AddPayRate from '../../../add/AddPayRate.Component';

import { useScheduleDateContext } from '../../../../scheduler/Scheduler.Component';

import { useAddGiftCardMutation } from '../../../../../../hooks/gift-card.hooks';
import { useUserQuery } from '../../../../../../hooks/profile.hooks';

import { paymentMethodDropDownItems } from '../../../../../../../constants/drop-down.constants';
import ERRORS from '../../../../../../../constants/error.constants';
import LABELS from '../../../../../../../constants/label.constants';
import LENGTHS from '../../../../../../../constants/lengths.constants';
import NAMES from '../../../../../../../constants/name.constants';
import NUMBERS from '../../../../../../../constants/numbers.constants';
import PATTERNS from '../../../../../../../constants/patterns.constants';
import PLACEHOLDERS from '../../../../../../../constants/placeholder.constants';

import { PaymentMethod, Permissions } from '../../../../../../../models/enums';
import User from '../../../../../../../models/User.Model';

import { AddGiftCardRequest } from '../../../../../../../models/requests/Gift-Card.Request';

interface AddGiftCardProp {
	setOpen(open: boolean): void;
}

const AddGiftCard: FC<AddGiftCardProp> = ({ setOpen }) => {
	const { t } = useTranslation();

	const { date } = useScheduleDateContext();

	const [giftCardIdInput, setGiftCardIdInput] = useState<string | null>(null);
	const [dateInput, setDateInput] = useState<Date | null>(date ?? new Date());
	const [paymentMethodInput, setPaymentMethodInput] =
		useState<PaymentMethod | null>(null);
	const [paymentAmountInput, setPaymentAmountInput] = useState<number | null>(
		null
	);

	const [invalidGiftCardId, setInvalidGiftCardId] = useState<boolean>(false);
	const [invalidDate, setInvalidDate] = useState<boolean>(false);
	const [invalidPaymentAmount, setInvalidPaymentAmount] =
		useState<boolean>(false);

	const [missingRequiredInput, setMissingRequiredInput] =
		useState<boolean>(true);
	const [invalidInput, setInvalidInput] = useState<boolean>(false);

	const userQuery = useUserQuery({ gettable: true, staleTime: Infinity });
	const user: User = userQuery.data;

	const creatable = user.permissions.includes(
		Permissions.PERMISSION_ADD_GIFT_CARD
	);

	useEffect(() => {
		const missingRequiredInput =
			giftCardIdInput === null ||
			dateInput === null ||
			paymentMethodInput === null ||
			paymentAmountInput === null;

		setMissingRequiredInput(missingRequiredInput);
	}, [giftCardIdInput, dateInput, paymentMethodInput, paymentAmountInput]);

	useEffect(() => {
		const invalidInput =
			invalidGiftCardId || invalidDate || invalidPaymentAmount;

		setInvalidInput(invalidInput);
	}, [invalidGiftCardId, invalidDate, invalidPaymentAmount]);

	const addGiftCardMutation = useAddGiftCardMutation({
		onSuccess: () => setOpen(false),
	});
	const onAddGiftCard = async (request: AddGiftCardRequest) => {
		addGiftCardMutation.mutate({ request });
	};

	const onAdd = () => {
		const gift_card_id = giftCardIdInput as string;
		const date = dateInput as Date;
		const payment_method = paymentMethodInput as PaymentMethod;
		const payment_amount = paymentAmountInput as number;

		const addGiftCardRequest: AddGiftCardRequest = {
			gift_card_id,
			date,
			payment_method,
			payment_amount,
		};

		onAddGiftCard(addGiftCardRequest);
	};

	return (
		<>
			<div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
				<div className="sm:flex sm:items-start">
					<div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
						<PlusCircleIcon
							className="h-6 w-6 text-green-600"
							aria-hidden="true"
						/>
					</div>

					<div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
						<Dialog.Title
							as="h3"
							className="text-base font-semibold leading-6 text-gray-900">
							{t('Add Gift Card')}
						</Dialog.Title>

						<div className="mt-2">
							<AddInput
								text={giftCardIdInput}
								setText={setGiftCardIdInput}
								label={LABELS.gift_card.gift_card_id}
								name={NAMES.gift_card.gift_card_id}
								type="text"
								validationProp={{
									maxLength: LENGTHS.gift_card.gift_card_id,
									pattern: PATTERNS.gift_card.gift_card_id,
									required: true,
									requiredMessage: ERRORS.gift_card.gift_card_id.required,
									invalid: invalidGiftCardId,
									setInvalid: setInvalidGiftCardId,
									invalidMessage: ERRORS.gift_card.gift_card_id.invalid,
								}}
								placeholder={PLACEHOLDERS.gift_card.gift_card_id}
							/>

							<AddDate
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
							/>

							<AddDropDown
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
							/>

							<AddPayRate
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
							/>
						</div>
					</div>
				</div>
			</div>

			<AddBottom
				onCancel={() => setOpen(false)}
				disabledAdd={!creatable || missingRequiredInput || invalidInput}
				addMissingPermissionMessage={
					!creatable
						? ERRORS.gift_card.permissions.add
						: missingRequiredInput
						? ERRORS.required
						: invalidInput
						? ERRORS.invalid
						: ''
				}
				onAdd={onAdd}
			/>
		</>
	);
};

export default AddGiftCard;
