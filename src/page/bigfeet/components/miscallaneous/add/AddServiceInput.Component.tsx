import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { Autocomplete, TextField } from '@mui/material';

import LABELS from '../../../../../constants/label.constants';

import { ServiceRecord } from '../../../../../models/Service.Model';
import ERRORS from '../../../../../constants/error.constants';

interface AddServiceProp {
	services: ServiceRecord[];
	service: ServiceRecord | null;
	setService(service: ServiceRecord | null): void;
	required: boolean;
}

const AddServiceInput: FC<AddServiceProp> = ({
	services,
	service,
	setService,
	required,
}) => {
	const { t } = useTranslation();

	return (
		<div className="mb-4">
			<Autocomplete
				className="input-div"
				options={services.sort((a, b) =>
					a.service_name.localeCompare(b.service_name)
				)}
				renderOption={(props, option: ServiceRecord) => (
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
									option.getOptionLabel(service).includes(option.inputValue) ||
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

			{required && service == null && (
				<p className="error-label">
					{t(ERRORS.reservation.service_id.required)}
				</p>
			)}
		</div>
	);
};

export default AddServiceInput;
