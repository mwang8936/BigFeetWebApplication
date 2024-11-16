import { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Autocomplete, TextField } from '@mui/material';

import ERRORS from '../../../../../constants/error.constants';
import LABELS from '../../../../../constants/label.constants';

import { ServiceRecord } from '../../../../../models/Service.Model';

import PermissionsButton from '../PermissionsButton.Component';

interface EditableServiceProp {
	services: ServiceRecord[];
	originalService: ServiceRecord | null;
	service: ServiceRecord | null;
	setService(service: ServiceRecord | null): void;
	required: boolean;
	editable: boolean;
	missingPermissionMessage: string;
}

const EditableServiceInput: FC<EditableServiceProp> = ({
	services,
	originalService,
	service,
	setService,
	required,
	editable,
	missingPermissionMessage,
}) => {
	const { t } = useTranslation();

	const [disabled, setDisabled] = useState(
		originalService?.service_id !== undefined
	);

	useEffect(() => {
		setDisabled(originalService?.service_id !== undefined);
	}, [originalService?.service_id]);

	const handleDisableBtnClick = () => {
		if (!disabled) {
			setService(originalService);
		}

		setDisabled(!disabled);
	};

	return (
		<div className="mb-4">
			<div className="div-input">
				<Autocomplete
					className="editable-div"
					style={{ width: '100%' }}
					disabled={disabled}
					options={services}
					renderOption={(props, option) => (
						<li
							{...props}
							style={{
								padding: '8px',
								display: 'flex',
								flexDirection: 'column',
							}}>
							<span
								style={{
									whiteSpace: 'nowrap',
								}}>
								<strong>{option.service_name}</strong>
							</span>

							<span
								style={{
									whiteSpace: 'nowrap',
								}}>
								<strong>{t('Shorthand')}:</strong> {option.shorthand}
							</span>

							<small
								style={{
									whiteSpace: 'nowrap',
								}}>
								<strong>{t('Money')}:</strong> ${option.money}{' '}
								<strong>{t('Time')}:</strong> {option.time} {t('Min')}{' '}
								<strong>{t('Beds Required')}:</strong> {option.beds_required}
							</small>
						</li>
					)}
					getOptionLabel={(option: ServiceRecord) =>
						`${option.service_name} | (${option.shorthand})`
					}
					renderInput={(params) => (
						<TextField
							{...params}
							label={t(LABELS.reservation.service_id)}
							variant="outlined"
						/>
					)}
					value={service}
					onChange={(_event, newValue) => setService(newValue)}
					filterOptions={(input, option) =>
						option.inputValue
							? input.filter(
									(service) =>
										option
											.getOptionLabel(service)
											.includes(option.inputValue) ||
										service.service_name
											?.toLowerCase()
											?.includes(option.inputValue.toLowerCase()) ||
										service.shorthand
											?.toLowerCase()
											?.includes(option.inputValue.toLowerCase())
							  )
							: input
					}
				/>

				<div className="ms-3">
					<PermissionsButton
						btnTitle={disabled ? 'Change' : 'Cancel'}
						disabled={!editable}
						missingPermissionMessage={missingPermissionMessage}
						onClick={handleDisableBtnClick}
					/>
				</div>
			</div>

			{required && service == null && (
				<p className="error-label">
					{t(ERRORS.reservation.service_id.required)}
				</p>
			)}
		</div>
	);
};

export default EditableServiceInput;
