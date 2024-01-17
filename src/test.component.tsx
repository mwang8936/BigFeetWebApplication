import React, { ReactNode, FC, MouseEventHandler, useState } from 'react';
import {
	MagnifyingGlassPlusIcon,
	MagnifyingGlassMinusIcon,
	MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';
import Calendar from './page/bigfeet/components/scheduler/Calendar/Calendar.Component';
import Employee from './models/Employee.Model';
import { Gender, Role } from './models/enums';

interface TransparentIconButtonProps {
	icon: ReactNode;
	onClick: MouseEventHandler<HTMLButtonElement>;
}

const TransparentIconButton: FC<TransparentIconButtonProps> = ({
	icon,
	onClick,
}) => {
	return (
		<button
			className="bg-gray-300 bg-opacity-50 border-none cursor-pointer p-2 mx-2 rounded"
			onClick={onClick}>
			<svg className="w-6 h-6 fill-current text-black" viewBox="0 0 24 24">
				{icon}
			</svg>
		</button>
	);
};

export default function TestComponent() {
	const Controls = () => {
		return (
			<div>
				<TransparentIconButton
					icon={<MagnifyingGlassPlusIcon aria-hidden="true" />}
					onClick={() => {}}
				/>
				<TransparentIconButton
					icon={<MagnifyingGlassMinusIcon aria-hidden="true" />}
					onClick={() => {}}
				/>
				<TransparentIconButton
					icon={<MagnifyingGlassIcon aria-hidden="true" />}
					onClick={() => {}}
				/>
			</div>
		);
	};

	const testEmployee1: Employee = {
		employee_id: 1,
		username: 'Test',
		first_name: 'First',
		last_name: 'Last',
		gender: Gender.MALE,
		role: Role.DEVELOPER,
		permissions: [],
		body_rate: 1.0,
		feet_rate: 2.0,
		per_hour: 3.0,
		created_at: new Date(),
		updated_at: new Date(),
	};

	const testEmployee2: Employee = {
		employee_id: 2,
		username: 'Test',
		first_name: 'First',
		last_name: 'Last',
		gender: Gender.MALE,
		role: Role.DEVELOPER,
		permissions: [],
		body_rate: 1.0,
		feet_rate: 2.0,
		per_hour: 3.0,
		created_at: new Date(),
		updated_at: new Date(),
	};

	const testEmployee3: Employee = {
		employee_id: 3,
		username: 'Test',
		first_name: 'First',
		last_name: 'Last',
		gender: Gender.MALE,
		role: Role.DEVELOPER,
		permissions: [],
		body_rate: 1.0,
		feet_rate: 2.0,
		per_hour: 3.0,
		created_at: new Date(),
		updated_at: new Date(),
	};

	const testEmployee4: Employee = {
		employee_id: 4,
		username: 'Test',
		first_name: 'First',
		last_name: 'Last',
		gender: Gender.MALE,
		role: Role.DEVELOPER,
		permissions: [],
		body_rate: 1.0,
		feet_rate: 2.0,
		per_hour: 3.0,
		created_at: new Date(),
		updated_at: new Date(),
	};

	const testEmployee5: Employee = {
		employee_id: 5,
		username: 'Test',
		first_name: 'First',
		last_name: 'Last',
		gender: Gender.MALE,
		role: Role.DEVELOPER,
		permissions: [],
		body_rate: 1.0,
		feet_rate: 2.0,
		per_hour: 3.0,
		created_at: new Date(),
		updated_at: new Date(),
	};

	// <div className="flex overflow-auto">
	// 		<div className="flex flex-col bg-white border border-gray-500">
	// 			<TransformWrapper>
	// 				<Controls />
	// 				<TransformComponent>
	// 					<Calendar
	// 						start={10}
	// 						end={22.5}
	// 						employees={[
	// 							testEmployee1,
	// 							testEmployee2,
	// 							testEmployee3,
	// 							testEmployee4,
	// 							testEmployee5,
	// 							testEmployee1,
	// 							testEmployee2,
	// 							testEmployee3,
	// 							testEmployee4,
	// 							testEmployee5,
	// 						]}
	// 						reservations={[]}
	// 					/>
	// 				</TransformComponent>
	// 			</TransformWrapper>
	// 		</div>
	// 	</div>

	return (
		<div className="h-screen w-screen">
			<div className="w-[75%] h-[75%] mx-auto">
				<div className="border border-gray-500">TEST</div>
				<div className="flex border border-gray-500 overflow-auto">
					<Calendar
						date={new Date()}
						start={10}
						end={22.5}
						employees={[
							testEmployee1,
							testEmployee2,
							testEmployee3,
							testEmployee4,
							testEmployee5,
							testEmployee1,
							testEmployee2,
							testEmployee3,
							testEmployee4,
							testEmployee5,
						]}
						reservations={[]}
					/>
				</div>
			</div>
		</div>
	);
}
