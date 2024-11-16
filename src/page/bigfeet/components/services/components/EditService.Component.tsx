import { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import EditServiceRecord from './EditServiceRecord.Component.tsx';

import {
	useServiceDateContext,
	useServiceShowDeletedContext,
} from '../Services.Component.tsx';

import Loading from '../../Loading.Component.tsx';

import DatesDisplay from '../../miscallaneous/DatesDisplay.Component.tsx';
import FilledPermissionsButton from '../../miscallaneous/FilledPermissionsButton.Component.tsx';
import PermissionsButton, {
	ButtonType,
} from '../../miscallaneous/PermissionsButton.Component.tsx';

import TimelineTabs from '../../miscallaneous/TimelineTabs.Component.tsx';
import EditableDropDown from '../../miscallaneous/editable/EditableDropDown.Component.tsx';
import EditableInput from '../../miscallaneous/editable/EditableInput.Component.tsx';

import DeleteServiceModal from '../../miscallaneous/modals/service/DeleteServiceModal.Component.tsx';
import RecoverServiceModal from '../../miscallaneous/modals/service/RecoverServiceModal.Component.tsx';

import { useUserQuery } from '../../../../hooks/profile.hooks.ts';
import {
	useContinueServiceMutation,
	useDiscontinueServiceMutation,
	useServiceQuery,
	useUpdateServiceMutation,
} from '../../../../hooks/service.hooks.ts';

import { colorDropDownItems } from '../../../../../constants/drop-down.constants.ts';
import ERRORS from '../../../../../constants/error.constants.ts';
import LABELS from '../../../../../constants/label.constants.ts';
import LENGTHS from '../../../../../constants/lengths.constants.ts';
import NAMES from '../../../../../constants/name.constants.ts';
import PATTERNS from '../../../../../constants/patterns.constants.ts';
import PLACEHOLDERS from '../../../../../constants/placeholder.constants.ts';

import { Permissions, ServiceColor } from '../../../../../models/enums.ts';
import { Service, ServiceRecord } from '../../../../../models/Service.Model.ts';
import User from '../../../../../models/User.Model.ts';

import {
	DiscontinueServiceRequest,
	UpdateServiceRequest,
} from '../../../../../models/requests/Service.Request.Model.ts';

interface EditServiceProp {
	service: Service;
}

const EditService: FC<EditServiceProp> = ({ service }) => {
	const { t } = useTranslation();

	const { date, setDate } = useServiceDateContext();
	const { showDeleted } = useServiceShowDeletedContext();

	const [serviceNameInput, setServiceNameInput] = useState<string | null>(
		service.service_name
	);
	const [shorthandInput, setShorthandInput] = useState<string | null>(
		service.shorthand
	);
	const [colorInput, setColorInput] = useState<ServiceColor | null>(
		service.color
	);

	const [invalidServiceName, setInvalidServiceName] = useState<boolean>(false);
	const [invalidShorthand, setInvalidShorthand] = useState<boolean>(false);

	const [changesMade, setChangesMade] = useState<boolean>(false);
	const [missingRequiredInput, setMissingRequiredInput] =
		useState<boolean>(false);
	const [invalidInput, setInvalidInput] = useState<boolean>(false);

	const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
	const [openRecoverModal, setOpenRecoverModal] = useState<boolean>(false);

	const userQuery = useUserQuery({ gettable: true, staleTime: Infinity });
	const user: User = userQuery.data;

	const gettable = user.permissions.includes(
		Permissions.PERMISSION_GET_SERVICE
	);
	const editable = user.permissions.includes(
		Permissions.PERMISSION_UPDATE_SERVICE
	);
	const deletable = user.permissions.includes(
		Permissions.PERMISSION_DELETE_SERVICE
	);

	const serviceQuery = useServiceQuery({
		serviceId: service.service_id,
		withDeleted: showDeleted,
		withRelations: true,
		gettable,
	});
	const records: ServiceRecord[] =
		serviceQuery.data?.records?.sort(
			(a, b) =>
				new Date(a.valid_from).getTime() - new Date(b.valid_from).getTime()
		) ?? [];

	const isServiceLoading = serviceQuery.isLoading;

	let serviceRecord = [...records]
		.reverse()
		.find((record) => date >= record.valid_from);

	useEffect(() => {
		setServiceNameInput(service.service_name);
		setShorthandInput(service.shorthand);
		setColorInput(service.color);

		setChangesMade(false);

		setMissingRequiredInput(false);

		setInvalidServiceName(false);
		setInvalidInput(false);
	}, [service]);

	useEffect(() => {
		const trimmedServiceName = serviceNameInput
			? serviceNameInput.trim()
			: null;
		const service_name: string | null | undefined =
			trimmedServiceName === service.service_name
				? undefined
				: trimmedServiceName;
		const trimmedShorthand = shorthandInput ? shorthandInput.trim() : null;
		const shorthand: string | null | undefined =
			trimmedShorthand === service.shorthand ? undefined : trimmedShorthand;
		const color: ServiceColor | null | undefined =
			colorInput === service.color ? undefined : colorInput;

		const changesMade =
			service_name !== undefined ||
			shorthand !== undefined ||
			color !== undefined;

		setChangesMade(changesMade);

		const missingRequiredInput =
			service_name === null || shorthand === null || color === null;

		setMissingRequiredInput(missingRequiredInput);
	}, [serviceNameInput, shorthandInput, colorInput]);

	useEffect(() => {
		const invalidInput = invalidServiceName || invalidShorthand;

		setInvalidInput(invalidInput);
	}, [invalidServiceName, invalidShorthand]);

	const updateServiceMutation = useUpdateServiceMutation({});
	const onSave = async () => {
		const service_name: string | undefined =
			(serviceNameInput as string).trim() === service.service_name
				? undefined
				: (serviceNameInput as string).trim();
		const shorthand: string | undefined =
			(shorthandInput as string).trim() === service.shorthand
				? undefined
				: (shorthandInput as string).trim();
		const color: ServiceColor | undefined =
			colorInput === service.color ? undefined : (colorInput as ServiceColor);

		const serviceId = service.service_id;
		const request: UpdateServiceRequest = {
			...(service_name !== undefined && { service_name }),
			...(shorthand !== undefined && { shorthand }),
			...(color !== undefined && { color }),
		};

		updateServiceMutation.mutate({ serviceId, request });
	};

	function getServiceDifferences(
		prevService: ServiceRecord,
		nextService: ServiceRecord
	): string[] {
		const diff: string[] = [];

		if (prevService.time !== nextService.time) {
			diff.push(
				`${t(LABELS.service.time)}: ${prevService.time} -> ${nextService.time}`
			);
		}

		if (prevService.money !== nextService.money) {
			diff.push(
				`${t(LABELS.service.money)}: ${prevService.money} -> ${
					nextService.money
				}`
			);
		}

		if (prevService.body !== nextService.body) {
			diff.push(
				`${t(LABELS.service.body)}: ${prevService.body} -> ${nextService.body}`
			);
		}

		if (prevService.feet !== nextService.feet) {
			diff.push(
				`${t(LABELS.service.feet)}: ${prevService.feet} -> ${nextService.feet}`
			);
		}

		if (prevService.acupuncture !== nextService.acupuncture) {
			diff.push(
				`${t(LABELS.service.acupuncture)}: ${prevService.acupuncture} -> ${
					nextService.acupuncture
				}`
			);
		}

		if (prevService.beds_required !== nextService.beds_required) {
			diff.push(
				`${t(LABELS.service.beds_required)}: ${prevService.beds_required} -> ${
					nextService.beds_required
				}`
			);
		}

		return diff;
	}

	const serviceId = service.service_id;

	const continueServiceMutation = useContinueServiceMutation({});
	const onContinue = async () => {
		continueServiceMutation.mutate({ serviceId });
	};

	const continueBtn = (
		<FilledPermissionsButton
			btnTitle={'Continue'}
			btnType={ButtonType.CANCEL}
			disabled={!editable}
			missingPermissionMessage={ERRORS.service.permissions.edit}
			onClick={onContinue}
		/>
	);

	const discontinueServiceMutation = useDiscontinueServiceMutation({});
	const onDiscontinue = async () => {
		const request: DiscontinueServiceRequest = {
			date,
		};
		discontinueServiceMutation.mutate({ serviceId, request });
	};

	const discontinueBtn = (
		<FilledPermissionsButton
			btnTitle={'Discontinue'}
			btnType={ButtonType.DELETE}
			disabled={!editable}
			missingPermissionMessage={ERRORS.service.permissions.edit}
			onClick={onDiscontinue}
		/>
	);

	let isLoadingElement = <Loading />;

	if (!isServiceLoading) {
		const tips: string[][] = [];

		let discontinuedDate: Date | undefined = undefined;

		if (records.length > 0) {
			tips.push([t('Service Created')]);
			discontinuedDate = records[records.length - 1].valid_to;
		}

		for (let i = 1; i < records.length; i++) {
			const prevRecord = records[i - 1];
			const nextRecord = records[i];

			tips.push(getServiceDifferences(prevRecord, nextRecord));
		}

		isLoadingElement = (
			<>
				<div className="records-box">
					<TimelineTabs
						dates={records.map((record) => record.valid_from)}
						date={date}
						setDate={setDate}
						tips={tips}
						discontinuedDate={discontinuedDate}
					/>

					{serviceRecord && <EditServiceRecord record={serviceRecord} />}

					{!records?.length && (
						<FilledPermissionsButton
							btnTitle="Add Service Record"
							btnType={ButtonType.ADD}
							disabled={!editable}
							missingPermissionMessage={ERRORS.service.permissions.edit}
							onClick={() => {}}
						/>
					)}
				</div>

				{!discontinuedDate
					? records?.length
						? discontinueBtn
						: undefined
					: continueBtn}
			</>
		);
	}

	return (
		<>
			<EditableInput
				originalText={service.service_name}
				text={serviceNameInput}
				setText={setServiceNameInput}
				label={LABELS.service.service_name}
				name={NAMES.service.service_name}
				type="text"
				validationProp={{
					maxLength: LENGTHS.service.service_name,
					pattern: PATTERNS.service.service_name,
					required: true,
					requiredMessage: ERRORS.service.service_name.required,
					invalid: invalidServiceName,
					setInvalid: setInvalidServiceName,
					invalidMessage: ERRORS.service.service_name.invalid,
				}}
				placeholder={PLACEHOLDERS.service.service_name}
				editable={editable}
				missingPermissionMessage={ERRORS.service.permissions.edit}
			/>

			<EditableInput
				originalText={service.shorthand}
				text={shorthandInput}
				setText={setShorthandInput}
				label={LABELS.service.shorthand}
				name={NAMES.service.shorthand}
				type="text"
				validationProp={{
					pattern: PATTERNS.service.shorthand,
					maxLength: LENGTHS.service.shorthand,
					required: true,
					invalid: invalidShorthand,
					setInvalid: setInvalidShorthand,
					invalidMessage: ERRORS.service.shorthand.invalid,
					requiredMessage: ERRORS.service.shorthand.required,
				}}
				placeholder={PLACEHOLDERS.service.shorthand}
				editable={editable}
				missingPermissionMessage={ERRORS.service.permissions.edit}
			/>

			<EditableDropDown
				originalOption={
					colorDropDownItems[
						colorDropDownItems.findIndex(
							(option) => option.id === service.color
						) || 0
					]
				}
				options={colorDropDownItems}
				option={
					colorDropDownItems[
						colorDropDownItems.findIndex(
							(option) => option.id === colorInput
						) || 0
					]
				}
				setOption={(option) => {
					setColorInput(option.id as ServiceColor | null);
				}}
				label={LABELS.service.color}
				validationProp={{
					required: true,
					requiredMessage: ERRORS.service.color.required,
				}}
				editable={editable}
				missingPermissionMessage={ERRORS.service.permissions.edit}
			/>

			<div className="bottom-bar">
				<PermissionsButton
					btnTitle={'Save Changes'}
					right={false}
					disabled={
						!editable || !changesMade || missingRequiredInput || invalidInput
					}
					missingPermissionMessage={
						!editable
							? ERRORS.service.permissions.edit
							: !changesMade
							? ERRORS.no_changes
							: missingRequiredInput
							? ERRORS.required
							: invalidInput
							? ERRORS.invalid
							: ''
					}
					onClick={onSave}
				/>

				{service.deleted_at ? (
					<PermissionsButton
						btnTitle={'Recover'}
						btnType={ButtonType.CANCEL}
						disabled={!deletable}
						missingPermissionMessage={ERRORS.service.permissions.recover}
						onClick={() => {
							setOpenRecoverModal(true);
						}}
					/>
				) : (
					<PermissionsButton
						btnTitle={'Delete'}
						btnType={ButtonType.DELETE}
						disabled={!deletable}
						missingPermissionMessage={ERRORS.service.permissions.delete}
						onClick={() => {
							setOpenDeleteModal(true);
						}}
					/>
				)}
			</div>

			{isLoadingElement}

			<DatesDisplay
				updatedAt={service.updated_at}
				createdAt={service.created_at}
			/>

			<DeleteServiceModal
				open={openDeleteModal}
				setOpen={setOpenDeleteModal}
				service={service}
			/>

			<RecoverServiceModal
				open={openRecoverModal}
				setOpen={setOpenRecoverModal}
				service={service}
			/>
		</>
	);
};

export default EditService;
