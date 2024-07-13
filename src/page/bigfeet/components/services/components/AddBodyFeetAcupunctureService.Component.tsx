import { FC, useEffect } from 'react';
import LABELS from '../../../../../constants/label.constants';
import NAMES from '../../../../../constants/name.constants';
import NUMBERS from '../../../../../constants/numbers.constants';
import PLACEHOLDERS from '../../../../../constants/placeholder.constants';
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

interface AddBodyFeetAcupunctureServiceProp {
	body: number | null;
	setBody(body: number | null): void;
	bodyValidationProp: BodyValidationProp;
	feet: number | null;
	setFeet(feet: number | null): void;
	feetValidationProp: FeetValidationProp;
	acupuncture: number | null;
	setAcupuncture(acupuncture: number | null): void;
	acupunctureValidationProp: AcupunctureValidationProp;
}

const AddBodyFeetAcupunctureService: FC<AddBodyFeetAcupunctureServiceProp> = ({
	body,
	setBody,
	bodyValidationProp,
	feet,
	setFeet,
	feetValidationProp,
	acupuncture,
	setAcupuncture,
	acupunctureValidationProp,
}) => {
	const { t } = useTranslation();

	useEffect(() => {
		if (body) {
			setFeet(0);
			setAcupuncture(0);
		}
	}, [body]);

	useEffect(() => {
		if (feet) {
			setBody(0);
			setAcupuncture(0);
		}
	}, [feet]);

	useEffect(() => {
		if (acupuncture) {
			setBody(0);
			setFeet(0);
		}
	}, [acupuncture]);
	return (
		<>
			<div>
				<label className="label" htmlFor={NAMES.service.body}>
					{t(LABELS.service.body)}
				</label>
				<div className="flex relative rounded-md shadow-sm">
					<input
						className="add-input pl-9"
						id={NAMES.service.body}
						type="number"
						value={body !== null ? body : ''}
						onChange={(event) => {
							const text = event.target.value.trimStart();

							setBody(text.length !== 0 ? parseFloat(text) : null);
							bodyValidationProp.setInvalid(!event.target.validity.valid);
						}}
						min={0}
						max={NUMBERS.service.body}
						step={0.5}
						required={true}
						placeholder={PLACEHOLDERS.service.body}
					/>
					<div className="absolute inset-y-0 left-0 flex items-center pointer-events-none pl-4">
						<span className="text-gray-500">{t('B')}</span>
					</div>
				</div>
				{bodyValidationProp.required && body === null ? (
					<p className="error-label">{bodyValidationProp.requiredMessage}</p>
				) : (
					bodyValidationProp.invalid && (
						<p className="error-label">
							{t(
								bodyValidationProp.invalidMessage.key,
								bodyValidationProp.invalidMessage.key
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
						className="add-input pl-9"
						id={NAMES.service.feet}
						type="number"
						value={feet !== null ? feet : ''}
						onChange={(event) => {
							const text = event.target.value.trimStart();

							setFeet(text.length !== 0 ? parseFloat(text) : null);
							feetValidationProp.setInvalid(!event.target.validity.valid);
						}}
						min={0}
						max={NUMBERS.service.feet}
						step={0.5}
						required={true}
						placeholder={PLACEHOLDERS.service.feet}
					/>
					<div className="absolute inset-y-0 left-0 flex items-center pointer-events-none pl-4">
						<span className="text-gray-500">{t('R')}</span>
					</div>
				</div>
				{feetValidationProp.required && feet === null ? (
					<p className="error-label">{feetValidationProp.requiredMessage}</p>
				) : (
					feetValidationProp.invalid && (
						<p className="error-label">
							{t(
								feetValidationProp.invalidMessage.key,
								feetValidationProp.invalidMessage.key
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
						className="add-input pl-9"
						id={NAMES.service.acupuncture}
						type="number"
						value={acupuncture !== null ? acupuncture : ''}
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
						placeholder={PLACEHOLDERS.service.acupuncture}
					/>
					<div className="absolute inset-y-0 left-0 flex items-center pointer-events-none pl-4">
						<span className="text-gray-500">{t('A')}</span>
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
								acupunctureValidationProp.invalidMessage.key
							)}
						</p>
					)
				)}
			</div>
		</>
	);
};

export default AddBodyFeetAcupunctureService;
