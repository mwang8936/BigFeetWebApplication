import { useState } from 'react';
import LENGTHS from '../../../../constants/lengths.constants.ts';
import PATTERNS from '../../../../constants/patterns.constants.ts';
import Service from '../../../../models/Service.Model.ts';
import { ServiceColor } from '../../../../models/enums.ts';
import EditableInput from '../miscallaneous/EditableInput.Component.tsx';
import EditableMinute from '../miscallaneous/EditableMinute.Component.tsx';
import EditablePayRate from '../miscallaneous/EditablePayRate.Component.tsx';
import SaveButton from '../miscallaneous/SaveButton.Component.tsx';
import DeleteButton from '../miscallaneous/DeleteButton.Component.tsx';
import { useServicesContext } from '../../BigFeet.Page.tsx';
import {
	deleteService,
	updateService,
} from '../../../../service/service.service.ts';
import { useNavigate } from 'react-router-dom';
import BodyFeetService from './BodyFeetService.Component.tsx';
import EditableDropDown from '../miscallaneous/EditableDropDown.Component.tsx';
import { colorDropDownItems } from '../../../../constants/drop-down.constants.ts';

interface EditServiceProp {
	editable: boolean;
	deletable: boolean;
	service: Service;
}

export default function EditService(prop: EditServiceProp) {
	const navigate = useNavigate();
	const [saving, setSaving] = useState(false);
	const [saveError, setSaveError] = useState('');
	const [saveSuccess, setSaveSuccess] = useState('');
	const [deleting, setDeleting] = useState(false);
	const [deleteError, setDeleteError] = useState('');
	const [deleteSuccess, setDeleteSuccess] = useState('');

	const [color, setColor] = useState<ServiceColor | null>(prop.service.color);

	const { services, setServices } = useServicesContext();

	const onSave = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setSaveError('');
		setSaveSuccess('');
		const service_name: string | undefined =
			event.currentTarget.service_name?.value?.trim();
		const shorthand: string | undefined =
			event.currentTarget.shorthand?.value?.trim();
		const time: number | undefined =
			event.currentTarget.time?.value?.trim();
		const money: number | undefined =
			event.currentTarget.money?.value?.trim();
		const body: number | undefined =
			event.currentTarget.body?.value?.trim();
		const feet: number | undefined =
			event.currentTarget.feet?.value?.trim();

		if (
			!service_name ||
			!shorthand ||
			!time ||
			!money ||
			(!body && !feet) ||
			!color
		) {
			setSaveError('Missing Required Field');
		} else if (
			service_name == prop.service.service_name &&
			shorthand == prop.service.shorthand &&
			time == prop.service.time &&
			money == prop.service.money &&
			body == prop.service.body &&
			feet == prop.service.feet &&
			color == prop.service.color
		) {
			setSaveError('No changes have been made');
		} else {
			const updateServiceRequest = {
				...(service_name != prop.service.service_name && {
					service_name,
				}),
				...(shorthand != prop.service.shorthand && { shorthand }),
				...(time != prop.service.time && { time }),
				...(money != prop.service.money && { money }),
				...(body != prop.service.body && { body }),
				...(feet != prop.service.feet && { feet }),
				...(color != prop.service.color && { color }),
			};
			setSaving(true);
			updateService(
				navigate,
				prop.service.service_id,
				updateServiceRequest
			)
				.then(() => {
					const updatedService = {
						...prop.service,
						...updateServiceRequest,
					};
					setServices(
						services.map((service) =>
							service.service_id == prop.service.service_id
								? updatedService
								: service
						)
					);
					setSaveSuccess('Successfully Saved');
				})
				.catch((error) => setSaveError(error.message))
				.finally(() => setSaving(false));
		}
	};

	const onDelete = async () => {
		setDeleteError('');
		setDeleteSuccess('');
		setDeleting(true);
		deleteService(navigate, prop.service.service_id)
			.then(() => {
				setServices(
					services.filter(
						(service) =>
							service.service_id != prop.service.service_id
					)
				);
				setDeleteSuccess('Successfully Deleted');
			})
			.catch((error) => setDeleteError(error.message))
			.finally(() => setDeleting(false));
	};

	return (
		<form onSubmit={onSave}>
			<EditableInput
				text={prop.service.service_name}
				label='Service Name'
				name='service_name'
				type='text'
				pattern={PATTERNS.service.service_name}
				maxLength={LENGTHS.service.service_name}
				placeholder='Body'
				required={true}
				editable={prop.editable}
				missingPermissionMessage='You do not have permission to change service details.'
				invalidMessage='Service Name must be within 1-50 characters.'
				requiredMessage='Service Name cannot be empty.'
			/>

			<EditableInput
				text={prop.service.shorthand}
				label='Shorthand'
				name='shorthand'
				type='text'
				pattern={PATTERNS.service.shorthand}
				maxLength={LENGTHS.service.shorthand}
				placeholder='BD'
				required={true}
				editable={prop.editable}
				missingPermissionMessage='You do not have permission to change service details.'
				invalidMessage='Shorthand must be within 1-50 characters.'
				requiredMessage='Shorthand cannot be empty.'
			/>

			<EditableMinute
				text={prop.service.time.toString()}
				label='Time (Minutes)'
				name='time'
				max={180}
				required={true}
				editable={prop.editable}
				missingPermissionMessage='You do not have permission to change service details.'
				invalidMessage='Time cannot be over 180 minutes and only contain digits.'
				requiredMessage='Time cannot be empty.'
			/>

			<EditablePayRate
				text={prop.service.money.toString()}
				label='Money'
				name='money'
				max={999}
				required={true}
				editable={prop.editable}
				missingPermissionMessage='You do not have permission to change service details.'
				invalidMessage='Money must be between $0-999 and limited to 2 decimal places.'
				requiredMessage='Money cannot be empty.'
			/>

			<BodyFeetService
				editable={prop.editable}
				body={prop.service.body}
				feet={prop.service.feet}
			/>

			<EditableDropDown
				default={
					colorDropDownItems.find(
						(option) => option.id == prop.service.color
					) || colorDropDownItems[0]
				}
				options={colorDropDownItems}
				onSelect={(option) => {
					if (option.id == null) setColor(null);
					else setColor(option.id as ServiceColor);
				}}
				label='Color'
				required={true}
				editable={prop.editable}
				missingPermissionMessage='You do not have permission to change service details.'
				requiredMessage='A color must be selected.'
			/>

			<div className='flex border-t-2 border-gray-400 py-4 justify-between'>
				<SaveButton
					loading={saving}
					disabled={!prop.editable}
					missingPermissionMessage='You do not have permission to change service details.'
					saveBtnTitle='Save Changes'
					savingBtnTitle='Saving...'
					error={saveError}
					success={saveSuccess}
				/>
				<DeleteButton
					loading={deleting}
					disabled={!prop.deletable}
					missingPermissionMessage='You do not have permission to delete services'
					onDelete={onDelete}
					deleteBtnTitle='Delete Service'
					deletingBtnTitle='Deleting Service...'
					deleteTitle={`Delete Service: ${prop.service.service_name}`}
					deleteMsg='Are you sure you want to
                    delete this service? This
                    action cannot be reversed.'
					error={deleteError}
					success={deleteSuccess}
				/>
			</div>
		</form>
	);
}
