import { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import PermissionsButton, { ButtonType } from '../PermissionsButton.Component';

interface InvalidMessage {
	key: string;
	value: Record<string, string | number>;
}

interface ValidationProp {
	max?: number;
	required: boolean;
	requiredMessage?: string;
	invalid: boolean;
	setInvalid(invalid: boolean): void;
	invalidMessage: InvalidMessage;
}

interface EditablePayRateAutomaticProp {
	originalAmount: number | null;
	remainingAmount: number;
	roundToTheNearestDollar: boolean;
	amount: number | null;
	setAmount(amount: number | null): void;
	label: string;
	name: string;
	validationProp: ValidationProp;
	placeholder: string;
	editable: boolean;
	missingPermissionMessage: string;
}

const EditablePayRateAutomatic: FC<EditablePayRateAutomaticProp> = ({
	originalAmount,
	remainingAmount,
	roundToTheNearestDollar,
	amount,
	setAmount,
	label,
	name,
	validationProp,
	placeholder,
	editable,
	missingPermissionMessage,
}) => {
	const { t } = useTranslation();

	const [disabled, setDisabled] = useState(originalAmount !== null);

	useEffect(() => {
		setDisabled(originalAmount !== null);
	}, [originalAmount]);

	const fillBtnClick = () => {
		const totalAmount = (amount ?? 0) + remainingAmount;
		setAmount(roundToTheNearestDollar ? Math.round(totalAmount) : totalAmount);
		validationProp.setInvalid(false);
	};

	const handleDisableBtnClick = () => {
		if (!disabled) {
			setAmount(originalAmount);
			validationProp.setInvalid(false);
		}
		setDisabled(!disabled);
	};

	return (
		<div className="mb-4">
			<label className="label" htmlFor={name}>
				{t(label)}
			</label>

			<div className="div-input">
				<input
					className="editable-input pl-9"
					id={name}
					type="number"
					value={amount === null ? '' : disabled ? amount.toFixed(2) : amount}
					onChange={(event) => {
						const amount = parseFloat(event.target.value);

						setAmount(isNaN(amount) ? null : amount);
						validationProp.setInvalid(!event.target.validity.valid);
					}}
					min={validationProp.required ? 0.01 : 0}
					max={validationProp.max}
					step={0.01}
					onWheel={(event) => event.currentTarget.blur()}
					required={validationProp.required}
					disabled={disabled}
					placeholder={placeholder}
				/>

				<div className="input-icon-div">
					<span className="text-gray-500">$</span>
				</div>

				<div className="ms-3">
					<PermissionsButton
						btnTitle={'Fill'}
						btnType={ButtonType.ADD}
						disabled={!editable || remainingAmount <= 0}
						missingPermissionMessage={
							!editable ? missingPermissionMessage : 'No remaining amount left.'
						}
						onClick={fillBtnClick}
					/>
				</div>

				<div className="ms-3">
					<PermissionsButton
						btnTitle={disabled ? 'Change' : 'Cancel'}
						disabled={!editable}
						missingPermissionMessage={missingPermissionMessage}
						onClick={handleDisableBtnClick}
					/>
				</div>
			</div>

			{validationProp.required && amount === null ? (
				<p className="error-label">
					{validationProp.requiredMessage && t(validationProp.requiredMessage)}
				</p>
			) : (
				validationProp.invalid && (
					<p className="error-label">
						{t(
							validationProp.invalidMessage.key,
							validationProp.invalidMessage.value
						)}
					</p>
				)
			)}
		</div>
	);
};

export default EditablePayRateAutomatic;
