import { useState } from 'react';
import EditService from './EditService.Component.tsx';
import Tabs from '../miscallaneous/Tabs.Component.tsx';
import { useServicesContext, useUserContext } from '../../BigFeet.Page.tsx';
import { Permissions, ServiceColor } from '../../../../models/enums.ts';
import AddButton from '../miscallaneous/AddButton.Component.tsx';
import { addService } from '../../../../service/service.service.ts';
import AddService from './AddService.Component.tsx';
import { useNavigate } from 'react-router-dom';

export default function Services() {
	const navigate = useNavigate();
	const [selectedTab, setSelectedTab] = useState(0);

	const [color, setColor] = useState<ServiceColor | null>(null);

	const { services, setServices } = useServicesContext();
	const { user } = useUserContext();

	const creatable = user.permissions.includes(
		Permissions.PERMISSION_ADD_SERVICE
	);
	const editable = user.permissions.includes(
		Permissions.PERMISSION_UPDATE_SERVICE
	);
	const deletable = user.permissions.includes(
		Permissions.PERMISSION_DELETE_SERVICE
	);

	const tabs = services.map((service) => service.service_name);

	const [adding, setAdding] = useState(false);
	const [addError, setAddError] = useState('');
	const [addSuccess, setAddSuccess] = useState('');

	const onAdd = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setAddError('');
		setAddSuccess('');
		const service_name: string | undefined =
			event.currentTarget.service_name?.value.trim();
		const shorthand: string | undefined =
			event.currentTarget.shorthand?.value.trim();
		const time: number | undefined = event.currentTarget.time?.value.trim();
		const money: number | undefined =
			event.currentTarget.money?.value.trim();
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
			setAddError('Missing Required Field');
		} else {
			const addServiceRequest = {
				service_name,
				shorthand,
				time,
				money,
				body,
				feet,
				color,
			};

			setAdding(true);
			addService(navigate, addServiceRequest)
				.then((response) => {
					const updatedServices = services;
					updatedServices.push(response);
					setServices(updatedServices);
					setAddSuccess('Successfully Added');
				})
				.catch((error) => setAddError(error.message))
				.finally(() => setAdding(false));
		}
	};

	return (
		<div className='w-11/12 mx-auto h-full flex-col'>
			<div className='h-28 bg-blue border-b-2 border-gray-400 flex flex-row justify-between'>
				<h1 className='my-auto text-gray-600 text-3xl'>Services</h1>
				<div className='h-fit my-auto flex'>
					<AddButton
						element={<AddService setColor={setColor} />}
						elementTitle='Add Service'
						loading={adding}
						disabled={!creatable}
						missingPermissionMessage='You do not have permission to create services.'
						onAdd={onAdd}
						addBtnTitle='Add Service'
						addingBtnTitle='Adding Service...'
						addTitle='Create Service'
						error={addError}
						success={addSuccess}
					/>
				</div>
			</div>
			<Tabs
				tabs={tabs}
				selectedTab={selectedTab}
				onTabSelected={setSelectedTab}
			/>
			<div className='mt-8 mb-4'>
				{services.length <= 0 ? (
					<h1 className='m-auto text-gray-600 text-3xl'>
						No Services Created
					</h1>
				) : (
					<>
						{services[selectedTab] && (
							<EditService
								editable={editable}
								deletable={deletable}
								service={services[selectedTab]}
							/>
						)}
					</>
				)}
			</div>
		</div>
	);
}
