import { FC, useEffect, useState } from 'react';

import PermissionsButton from '../../miscallaneous/PermissionsButton.Component';
import NUMBERS from '../../../../../constants/numbers.constants';
import PLACEHOLDERS from '../../../../../constants/placeholder.constants';
import NAMES from '../../../../../constants/name.constants';
import LABELS from '../../../../../constants/label.constants';
import { useTranslation } from 'react-i18next';

interface InvalidMessage {
	key: string;
	value: Record<string, string | number>;
}

interface BodyValidationProp {
	required: boolean;
	requiredMessage?: string;
	invalid: boolean;
	setInvalid(invalid: boolean): void;
	invalidMessage: InvalidMessage;
}

interface FeetValidationProp {
	required: boolean;
	requiredMessage?: string;
	invalid: boolean;
	setInvalid(invalid: boolean): void;
	invalidMessage: InvalidMessage;
}

interface AcupunctureValidationProp {
	required: boolean;
	requiredMessage?: string;
	invalid: boolean;
	setInvalid(invalid: boolean): void;
	invalidMessage: InvalidMessage;
}

interface EditableBodyFeetAcupunctureServiceProp {
	originalBody: number | null;
	body: number | null;
	setBody(body: number | null): void;
	bodyValidationProp: BodyValidationProp;
	originalFeet: number | null;
	feet: number | null;
	setFeet(feet: number | null): void;
	feetValidationProp: FeetValidationProp;
	originalAcupuncture: number | null;
	acupuncture: number | null;
	setAcupuncture(acupuncture: number | null): void;
	acupunctureValidationProp: AcupunctureValidationProp;
	editable: boolean;
	missingPermissionMessage: string;
}

const EditableBodyFeetAcupunctureService: FC<
	EditableBodyFeetAcupunctureServiceProp
> = ({
	originalBody,
	body,
	setBody,
	bodyValidationProp,
	originalFeet,
	feet,
	setFeet,
	feetValidationProp,
	originalAcupuncture,
	acupuncture,
	setAcupuncture,
	acupunctureValidationProp,
	editable,
	missingPermissionMessage,
}) => {
	const { t } = useTranslation();

	const [disabledBody, setDisabledBody] = useState(true);

	const [disabledFeet, setDisabledFeet] = useState(true);

	const [disabledAcupuncture, setDisabledAcupuncture] = useState(true);

	useEffect(() => {
		setDisabledBody(true);
	}, [originalBody]);

	useEffect(() => {
		setDisabledFeet(true);
	}, [originalFeet]);

	useEffect(() => {
		setDisabledAcupuncture(true);
	}, [originalAcupuncture]);

	useEffect(() => {
		if (body?.toString() && parseFloat(body.toString())) {
			if (feet?.toString() && parseFloat(feet.toString())) {
				setFeet(0);
				setDisabledFeet(false);
			}

			if (acupuncture?.toString() && parseFloat(acupuncture.toString())) {
				setAcupuncture(0);
				setDisabledAcupuncture(false);
			}
		}
	}, [body]);

	useEffect(() => {
		if (feet?.toString() && parseFloat(feet.toString())) {
			if (body?.toString() && parseFloat(body.toString())) {
				setBody(0);
				setDisabledBody(false);
			}

			if (acupuncture?.toString() && parseFloat(acupuncture.toString())) {
				setAcupuncture(0);
				setDisabledAcupuncture(false);
			}
		}
	}, [feet]);

	useEffect(() => {
		if (acupuncture?.toString() && parseFloat(acupuncture.toString())) {
			if (body?.toString() && parseFloat(body.toString())) {
				setBody(0);
				setDisabledBody(false);
			}

			if (feet?.toString() && parseFloat(feet.toString())) {
				setFeet(0);
				setDisabledFeet(false);
			}
		}
	}, [acupuncture]);

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

	const handleDisableAcupunctureBtnClick = () => {
		if (!disabledAcupuncture) {
			setAcupuncture(originalAcupuncture);
			acupunctureValidationProp.setInvalid(false);
		}
		setDisabledAcupuncture(!disabledAcupuncture);
	};

	return (
		<>
			<div>
				<label className="label" htmlFor={NAMES.service.body}>
					{t(LABELS.service.body)}
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
						<p className="error-label">
							{t(
								bodyValidationProp.invalidMessage.key,
								bodyValidationProp.invalidMessage.value
							)}
						</p>
					)
				)}
			</div>

			<div>
				<label className="label" htmlFor={NAMES.service.feet}>
					{t(LABELS.service.feet)}
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
						<span className="text-gray-500">{t('F')}</span>
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
						<p className="error-label">
							{t(
								feetValidationProp.invalidMessage.key,
								feetValidationProp.invalidMessage.value
							)}
						</p>
					)
				)}
			</div>

			<div>
				<label className="label" htmlFor={NAMES.service.acupuncture}>
					{t(LABELS.service.acupuncture)}
				</label>
				<div className="flex relative rounded-md shadow-sm">
					<input
						className="editable-input pl-9"
						id={NAMES.service.acupuncture}
						type="number"
						value={
							acupuncture !== null ? parseFloat(acupuncture.toString()) : ''
						}
						onChange={(event) => {
							const text = event.target.value.trimStart();

							setAcupuncture(text.length !== 0 ? parseFloat(text) : null);
							acupunctureValidationProp.setInvalid(
								!event.target.validity.valid
							);
						}}
						min={0}
						max={NUMBERS.service.acupuncture}
						step={0.5}
						required={true}
						disabled={disabledAcupuncture}
						placeholder={PLACEHOLDERS.service.acupuncture}
					/>
					<div className="absolute inset-y-0 left-0 flex items-center pointer-events-none pl-4">
						<span className="text-gray-500">{t('A')}</span>
					</div>
					<div className="ms-3">
						<PermissionsButton
							btnTitle={disabledAcupuncture ? t('Change') : t('Cancel')}
							disabled={!editable}
							missingPermissionMessage={missingPermissionMessage}
							onClick={handleDisableAcupunctureBtnClick}
						/>
					</div>
				</div>
				{acupunctureValidationProp.required && acupuncture === null ? (
					<p className="error-label">
						{acupunctureValidationProp.requiredMessage}
					</p>
				) : (
					acupunctureValidationProp.invalid && (
						<p className="error-label">
							{t(
								acupunctureValidationProp.invalidMessage.key,
								acupunctureValidationProp.invalidMessage.value
							)}
						</p>
					)
				)}
			</div>
		</>
	);
};

export default EditableBodyFeetAcupunctureService;
