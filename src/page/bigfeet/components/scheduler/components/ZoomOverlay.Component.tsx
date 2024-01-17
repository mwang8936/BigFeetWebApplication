import {
	MagnifyingGlassPlusIcon,
	MagnifyingGlassMinusIcon,
	MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';
import { FC } from 'react';

interface ZoomOverlayProp {
	zoomIn(): void;
	zoomOut(): void;
	zoomReset(): void;
}

const ZoomOverlay: FC<ZoomOverlayProp> = ({ zoomIn, zoomOut, zoomReset }) => {
	const ZoomInButton = () => {
		return (
			<button
				className="flex w-16 h-16 p-2 mx-2 bg-gray-400 text-black hover:bg-gray-500 focus:outline-none bg-opacity-50 justify-center"
				onClick={zoomIn}>
				<MagnifyingGlassPlusIcon
					className="h-12 w-12 text-black"
					aria-hidden="true"
				/>
			</button>
		);
	};

	const ZoomOutButton = () => {
		return (
			<button
				className="flex w-16 h-16 p-2 mx-2 bg-gray-400 text-black hover:bg-gray-500 focus:outline-none bg-opacity-50 justify-center"
				onClick={zoomOut}>
				<MagnifyingGlassMinusIcon
					className="h-12 w-12 text-black"
					aria-hidden="true"
				/>
			</button>
		);
	};

	const ZoomResetButton = () => {
		return (
			<button
				className="flex w-16 h-16 p-2 mx-2 bg-gray-400 text-black hover:bg-gray-500 focus:outline-none bg-opacity-50 justify-center"
				onClick={zoomReset}>
				<MagnifyingGlassIcon
					className="h-12 w-12 text-black"
					aria-hidden="true"
				/>
			</button>
		);
	};
	return (
		<>
			<ZoomInButton />
			<ZoomOutButton />
			<ZoomResetButton />
		</>
	);
};

export default ZoomOverlay;
