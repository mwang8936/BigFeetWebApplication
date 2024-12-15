import { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Autocomplete, TextField } from '@mui/material';

import AddInput from './AddInput.Component';
import AddPhoneNumber from './AddPhoneNumber.Component';
import AddTextArea from './AddTextArea.Component';

import Tabs from '../Tabs.Component';

import ERRORS from '../../../../../constants/error.constants';
import LABELS from '../../../../../constants/label.constants';
import LENGTHS from '../../../../../constants/lengths.constants';
import NAMES from '../../../../../constants/name.constants';
import PATTERNS from '../../../../../constants/patterns.constants';
import PLACEHOLDERS from '../../../../../constants/placeholder.constants';

import Customer from '../../../../../models/Customer.Model';

import { formatPhoneNumber } from '../../../../../utils/string.utils';

interface ValidationProp {
	invalid: boolean;
	setInvalid(invalid: boolean): void;
}

interface AddCustomerProp {
	customers: Customer[];
	customer: Customer | null;
	setCustomer(customer: Customer | null): void;
	phoneNumber: string | null;
	setPhoneNumber(phoneNumber: string | null): void;
	phoneNumberValidationProp: ValidationProp;
	vipSerial: string | null;
	setVipSerial(vipSerial: string | null): void;
	vipSerialvalidationProp: ValidationProp;
	customerName: string | null;
	setCustomerName(customerName: string | null): void;
	customerNameValidationProp: ValidationProp;
	notes: string | null;
	setNotes(notes: string | null): void;
}

const AddCustomerInput: FC<AddCustomerProp> = ({
	customers,
	customer,
	setCustomer,
	phoneNumber,
	setPhoneNumber,
	phoneNumberValidationProp,
	vipSerial,
	setVipSerial,
	vipSerialvalidationProp,
	customerName,
	setCustomerName,
	customerNameValidationProp,
	notes,
	setNotes,
}) => {
	const { t } = useTranslation();

	const [selectedTab, setSelectedTab] = useState(0);

	const tabs = [t('Search Customer'), t('Add Customer')];

	useEffect(() => {
		if (selectedTab === 0) {
			setPhoneNumber(null);
			setVipSerial(null);
			setCustomerName(null);
			setNotes(null);

			phoneNumberValidationProp.setInvalid(false);
			vipSerialvalidationProp.setInvalid(false);
			customerNameValidationProp.setInvalid(false);
		} else if (selectedTab === 1) {
			setCustomer(null);
		}
	}, [selectedTab]);

	const searchCustomerDiv = (
		<div className="mb-4">
			<Autocomplete
				className="input-div"
				options={customers}
				renderOption={(props, option) => (
					<li
						{...props}
						style={{
							padding: '8px',
							display: 'flex',
							flexDirection: 'column',
						}}>
						{option.customer_name && (
							<span>
								<strong>{t('Customer Name')}:</strong> {option.customer_name}
							</span>
						)}

						{option.phone_number && (
							<span>
								<strong>{t('Phone Number')}:</strong>{' '}
								{formatPhoneNumber(option.phone_number)}
							</span>
						)}

						{option.vip_serial && (
							<span>
								<strong>{t('VIP Serial')}:</strong> {option.vip_serial}
							</span>
						)}

						{option.notes && (
							<small>
								<strong>{t('Notes')}:</strong> {option.notes}
							</small>
						)}
					</li>
				)}
				getOptionLabel={(option) => {
					let label = '';
					if (option.customer_name) {
						label = label + option.customer_name;

						if (option.phone_number || option.vip_serial) {
							label = label + ' | ';
						}
					}
					if (option.phone_number) {
						label = label + formatPhoneNumber(option.phone_number);

						if (option.vip_serial) {
							label = label + ' | ';
						}
					}
					if (option.vip_serial) {
						label = label + option.vip_serial;
					}

					return label;
				}}
				renderInput={(params) => (
					<TextField
						{...params}
						label={t(LABELS.reservation.customer_id)}
						variant="outlined"
					/>
				)}
				value={customer}
				onChange={(_event, newValue) => setCustomer(newValue)}
				filterOptions={(input, option) =>
					option.inputValue
						? input.filter(
								(customer) =>
									option.getOptionLabel(customer).includes(option.inputValue) ||
									customer.phone_number
										?.toLowerCase()
										?.includes(option.inputValue.toLowerCase()) ||
									customer.vip_serial
										?.toLowerCase()
										?.includes(option.inputValue.toLowerCase()) ||
									customer.customer_name
										?.toLowerCase()
										?.includes(option.inputValue.toLowerCase())
						  )
						: input
				}
			/>
		</div>
	);

	const addCustomerDiv = (
		<div>
			<AddPhoneNumber
				phoneNumber={phoneNumber}
				setPhoneNumber={setPhoneNumber}
				label={LABELS.customer.phone_number}
				name={NAMES.customer.phone_number}
				validationProp={{
					required: false,
					invalid: phoneNumberValidationProp.invalid,
					setInvalid: phoneNumberValidationProp.setInvalid,
					invalidMessage: ERRORS.customer.phone_number.invalid,
				}}
			/>

			<AddInput
				text={vipSerial}
				setText={setVipSerial}
				label={LABELS.customer.vip_serial}
				name={NAMES.customer.vip_serial}
				type="text"
				validationProp={{
					maxLength: LENGTHS.customer.vip_serial,
					pattern: PATTERNS.customer.vip_serial,
					required: false,
					invalid: vipSerialvalidationProp.invalid,
					setInvalid: vipSerialvalidationProp.setInvalid,
					invalidMessage: ERRORS.customer.vip_serial.invalid,
				}}
				placeholder={PLACEHOLDERS.customer.vip_serial}
			/>

			{((phoneNumber?.length === 10 && !phoneNumberValidationProp.invalid) ||
				(vipSerial?.length === 6 && !vipSerialvalidationProp.invalid)) && (
				<>
					<AddInput
						text={customerName}
						setText={setCustomerName}
						label={LABELS.customer.customer_name}
						name={NAMES.customer.customer_name}
						type="text"
						validationProp={{
							maxLength: LENGTHS.customer.customer_name,
							required: false,
							invalid: customerNameValidationProp.invalid,
							setInvalid: customerNameValidationProp.setInvalid,
							invalidMessage: ERRORS.customer.customer_name.invalid,
						}}
						placeholder={PLACEHOLDERS.customer.customer_name}
					/>

					<AddTextArea
						text={notes}
						setText={setNotes}
						label={LABELS.customer.notes}
						name={NAMES.customer.notes}
						validationProp={{
							required: false,
						}}
						placeholder={PLACEHOLDERS.customer.notes}
					/>
				</>
			)}
		</div>
	);

	return (
		<div>
			<Tabs
				tabs={tabs}
				selectedTab={selectedTab}
				onTabSelected={setSelectedTab}
			/>

			<div className="mt-4">
				{selectedTab === 0 ? (
					searchCustomerDiv
				) : selectedTab === 1 ? (
					addCustomerDiv
				) : (
					<></>
				)}
			</div>
		</div>
	);
};

export default AddCustomerInput;
