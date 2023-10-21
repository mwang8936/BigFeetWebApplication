interface DatesDisplayProp {
	updatedAt: Date;
	createdAt: Date;
}

export default function DatesDisplay(prop: DatesDisplayProp) {
	return (
		<div className='flex flex-col text-sm font-medium text-gray-500 italic'>
			<div>Last Updated: {prop.updatedAt.toLocaleDateString()}</div>
			<div>Created: {prop.createdAt.toLocaleDateString()}</div>
		</div>
	);
}
