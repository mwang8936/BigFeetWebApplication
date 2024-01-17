import { FC, useEffect, useState } from 'react';

import PermissionsButton from '../../miscallaneous/PermissionsButton.Component';
import NUMBERS from '../../../../../constants/numbers.constants';
import PLACEHOLDERS from '../../../../../constants/placeholder.constants';
import NAMES from '../../../../../constants/name.constants';
import LABELS from '../../../../../constants/label.constants';
import { useTranslation } from 'react-i18next';

interface BodyValidationProp {
	required: boolean;
	requiredMessage?: string;
	invalid: boolean;
	setInvalid(invalid: boolean): void;
	invalidMessage: string;
}

interface FeetValidationProp {
	required: boolean;
	requiredMessage?: string;
	invalid: boolean;
	setInvalid(invalid: boolean): void;
	invalidMessage: string;
}

interface AccupunctureValidationProp {
	required: boolean;
	requiredMessage?: string;
	invalid: boolean;
	setInvalid(invalid: boolean): void;
	invalidMessage: string;
}

interface EditableBodyFeetAccupunctureServiceProp {
	originalBody: number | null;
	body: number | null;
	setBody(body: number | null): void;
	bodyValidationProp: BodyValidationProp;
	originalFeet: number | null;
	feet: number | null;
	setFeet(feet: number | null): void;
	feetValidationProp: FeetValidationProp;
	originalAccupuncture: number | null;
	accupuncture: number | null;
	setAccupuncture(accupuncture: number | null): void;
	accupunctureValidationProp: AccupunctureValidationProp;
	editable: boolean;
	missingPermissionMessage: string;
}

const EditableBodyFeetAccupunctureService: FC<
	EditableBodyFeetAccupunctureServiceProp
> = ({
	originalBody,
	body,
	setBody,
	bodyValidationProp,
	originalFeet,
	feet,
	setFeet,
	feetValidationProp,
	originalAccupuncture,
	accupuncture,
	setAccupuncture,
	accupunctureValidationProp,
	editable,
	missingPermissionMessage,
}) => {
	const { t } = useTranslation();

	const [disabledBody, setDisabledBody] = useState(true);

	const [disabledFeet, setDisabledFeet] = useState(true);

	const [disabledAccupuncture, setDisabledAccupuncture] = useState(true);

	useEffect(() => {
		setDisabledBody(true);
	}, [originalBody]);

	useEffect(() => {
		setDisabledFeet(true);
	}, [originalFeet]);

	useEffect(() => {
		setDisabledAccupuncture(true);
	}, [originalAccupuncture]);

	useEffect(() => {
		if (body?.toString() && parseFloat(body.toString())) {
			if (feet?.toString() && parseFloat(feet.toString())) {
				setFeet(0);
				setDisabledFeet(false);
			}

			if (accupuncture?.toString() && parseFloat(accupuncture.toString())) {
				setAccupuncture(0);
				setDisabledAccupuncture(false);
			}
		}
	}, [body]);

	useEffect(() => {
		if (feet?.toString() && parseFloat(feet.toString())) {
			if (body?.toString() && parseFloat(body.toString())) {
				setBody(0);
				setDisabledBody(false);
			}

			if (accupuncture?.toString() && parseFloat(accupuncture.toString())) {
				setAccupuncture(0);
				setDisabledAccupuncture(false);
			}
		}
	}, [feet]);

	useEffect(() => {
		if (accupuncture?.toString() && parseFloat(accupuncture.toString())) {
			if (body?.toString() && parseFloat(body.toString())) {
				setBody(0);
				setDisabledBody(false);
			}

			if (feet?.toString() && parseFloat(feet.toString())) {
				setFeet(0);
				setDisabledFeet(false);
			}
		}
	}, [accupuncture]);

	const handleDisableBodyBtnClick = () => {
		if (!disabledBody) {
			setBody(originalBody);
			bodyValidationProp.setInvalid(false);
		}
		setDisabledBody(!disabledBody);
	};

	const handleDisableFeetBtnClick = () => {
		if (!disabledFeet) {
			setFeet(originalFeet);
			feetValidationProp.setInvalid(false);
		}
		setDisabledFeet(!disabledFeet);
	};

	const handleDisableAccupunctureBtnClick = () => {
		if (!disabledAccupuncture) {
			setAccupuncture(originalAccupuncture);
			accupunctureValidationProp.setInvalid(false);
		}
		setDisabledAccupuncture(!disabledAccupuncture);
	};

	return (
		<>
			<div>
				<label className="label" htmlFor={NAMES.service.body}>
					{LABELS.service.body}
				</label>
				<div className="flex relative rounded-md shadow-sm">
					<input
						className="editable-input pl-9"
						id={NAMES.service.body}
						type="number"
						value={body !== null ? parseFloat(body.toString()) : ''}
						onChange={(event) => {
							const text = event.target.value.trimStart();

							setBody(text.length !== 0 ? parseFloat(text) : null);
							bodyValidationProp.setInvalid(!event.target.validity.valid);
						}}
						min={0}
						max={NUMBERS.service.body}
						step={0.5}
						required={true}
						disabled={disabledBody}
						placeholder={PLACEHOLDERS.service.body}
					/>
					<div className="absolute inset-y-0 left-0 flex items-center pointer-events-none pl-4">
						<span className="text-gray-500">{t('B')}</span>
					</div>
					<div className="ms-3">
						<PermissionsButton
							btnTitle={disabledBody ? t('Change') : t('Cancel')}
							disabled={!editable}
							missingPermissionMessage={missingPermissionMessage}
							onClick={handleDisableBodyBtnClick}
						/>
					</div>
				</div>
				{bodyValidationProp.required && body === null ? (
					<p className="error-label">{bodyValidationProp.requiredMessage}</p>
				) : (
					bodyValidationProp.invalid && (
						<p className="error-label">{bodyValidationProp.invalidMessage}</p>
					)
				)}
			</div>

			<div>
				<label className="label" htmlFor={NAMES.service.feet}>
					{LABELS.service.feet}
				</label>
				<div className="flex relative rounded-md shadow-sm">
					<input
						className="editable-input pl-9"
						id={NAMES.service.feet}
						type="number"
						value={feet !== null ? parseFloat(feet.toString()) : ''}
						onChange={(event) => {
							const text = event.target.value.trimStart();

							setFeet(text.length !== 0 ? parseFloat(text) : null);
							feetValidationProp.setInvalid(!event.target.validity.valid);
						}}
						min={0}
						max={NUMBERS.service.feet}
						step={0.5}
						required={true}
						disabled={disabledFeet}
						placeholder={PLACEHOLDERS.service.feet}
					/>
					<div className="absolute inset-y-0 left-0 flex items-center pointer-events-none pl-4">
						<span className="text-gray-500">{t('R')}</span>
					</div>
					<div className="ms-3">
						<PermissionsButton
							btnTitle={disabledFeet ? t('Change') : t('Cancel')}
							disabled={!editable}
							missingPermissionMessage={missingPermissionMessage}
							onClick={handleDisableFeetBtnClick}
						/>
					</div>
				</div>
				{feetValidationProp.required && feet === null ? (
					<p className="error-label">{feetValidationProp.requiredMessage}</p>
				) : (
					feetValidationProp.invalid && (
						<p className="error-label">{feetValidationProp.invalidMessage}</p>
					)
				)}
			</div>

			<div>
				<label className="label" htmlFor={NAMES.service.accupuncture}>
					{LABELS.service.accupuncture}
				</label>
				<div className="flex relative rounded-md shadow-sm">
					<input
						className="editable-input pl-9"
						id={NAMES.service.accupuncture}
						type="number"
						value={
							accupuncture !== null ? parseFloat(accupuncture.toString()) : ''
						}
						onChange={(event) => {
							const text = event.target.value.trimStart();

							setAccupuncture(text.length !== 0 ? parseFloat(text) : null);
							accupunctureValidationProp.setInvalid(
								!event.target.validity.valid
							);
						}}
						min={0}
						max={NUMBERS.service.accupuncture}
						step={0.5}
						required={true}
						disabled={disabledAccupuncture}
						placeholder={PLACEHOLDERS.service.accupuncture}
					/>
					<div className="absolute inset-y-0 left-0 flex items-center pointer-events-none pl-4">
						<span className="text-gray-500">{t('A')}</span>
					</div>
					<div className="ms-3">
						<PermissionsButton
							btnTitle={disabledAccupuncture ? t('Change') : t('Cancel')}
							disabled={!editable}
							missingPermissionMessage={missingPermissionMessage}
							onClick={handleDisableAccupunctureBtnClick}
						/>
					</div>
				</div>
				{accupunctureValidationProp.required && accupuncture === null ? (
					<p className="error-label">
						{accupunctureValidationProp.requiredMessage}
					</p>
				) : (
					accupunctureValidationProp.invalid && (
						<p className="error-label">
							{accupunctureValidationProp.invalidMessage}
						</p>
					)
				)}
			</div>
		</>
	);
};

export default EditableBodyFeetAccupunctureService;
