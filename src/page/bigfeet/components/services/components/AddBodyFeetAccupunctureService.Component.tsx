import { FC, useEffect } from 'react';
import LABELS from '../../../../../constants/label.constants';
import NAMES from '../../../../../constants/name.constants';
import NUMBERS from '../../../../../constants/numbers.constants';
import PLACEHOLDERS from '../../../../../constants/placeholder.constants';
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

interface AddBodyFeetAccupunctureServiceProp {
	body: number | null;
	setBody(body: number | null): void;
	bodyValidationProp: BodyValidationProp;
	feet: number | null;
	setFeet(feet: number | null): void;
	feetValidationProp: FeetValidationProp;
	accupuncture: number | null;
	setAccupuncture(accupuncture: number | null): void;
	accupunctureValidationProp: AccupunctureValidationProp;
}

const AddBodyFeetAccupunctureService: FC<
	AddBodyFeetAccupunctureServiceProp
> = ({
	body,
	setBody,
	bodyValidationProp,
	feet,
	setFeet,
	feetValidationProp,
	accupuncture,
	setAccupuncture,
	accupunctureValidationProp,
}) => {
	const { t } = useTranslation();

	useEffect(() => {
		if (body) {
			setFeet(0);
			setAccupuncture(0);
		}
	}, [body]);

	useEffect(() => {
		if (feet) {
			setBody(0);
			setAccupuncture(0);
		}
	}, [feet]);

	useEffect(() => {
		if (accupuncture) {
			setBody(0);
			setFeet(0);
		}
	}, [accupuncture]);
	return (
		<>
			<div>
				<label className="label" htmlFor={NAMES.service.body}>
					{LABELS.service.body}
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
						className="add-input pl-9"
						id={NAMES.service.accupuncture}
						type="number"
						value={accupuncture !== null ? accupuncture : ''}
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
						placeholder={PLACEHOLDERS.service.accupuncture}
					/>
					<div className="absolute inset-y-0 left-0 flex items-center pointer-events-none pl-4">
						<span className="text-gray-500">{t('A')}</span>
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

export default AddBodyFeetAccupunctureService;
