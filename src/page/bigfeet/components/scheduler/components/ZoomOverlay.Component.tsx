import {
	MagnifyingGlassPlusIcon,
	MagnifyingGlassMinusIcon,
	MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';
import { FC } from 'react';
import Draggable from 'react-draggable';

interface ZoomOverlayProp {
	zoomIn(): void;
	zoomOut(): void;
	zoomReset(): void;
}

const ZoomOverlay: FC<ZoomOverlayProp> = ({ zoomIn, zoomOut, zoomReset }) => {
	const ZoomInButton = () => {
		return (
			<button
				className="flex w-12 h-12 p-2 mx-2 bg-gray-400 text-black hover:bg-gray-500 focus:outline-none bg-opacity-50 justify-center"
				onClick={zoomIn}>
				<MagnifyingGlassPlusIcon
					className="h-8 w-8 text-black"
					aria-hidden="true"
				/>
			</button>
		);
	};

	const ZoomOutButton = () => {
		return (
			<button
				className="flex w-12 h-12 p-2 mx-2 bg-gray-400 text-black hover:bg-gray-500 focus:outline-none bg-opacity-50 justify-center"
				onClick={zoomOut}>
				<MagnifyingGlassMinusIcon
					className="h-8 w-8 text-black"
					aria-hidden="true"
				/>
			</button>
		);
	};

	const ZoomResetButton = () => {
		return (
			<button
				className="flex w-12 h-12 p-2 mx-2 bg-gray-400 text-black hover:bg-gray-500 focus:outline-none bg-opacity-50 justify-center"
				onClick={zoomReset}>
				<MagnifyingGlassIcon
					className="h-8 w-8 text-black"
					aria-hidden="true"
				/>
			</button>
		);
	};
	return (
		<Draggable axis="y" bounds="parent">
			<div className="absolute flex flex-row justify-between h-auto w-auto p-2 right-[5%] bottom-0 mb-10 z-[4] border border-black bg-gray-200 bg-opacity-50 cursor-move">
				<ZoomInButton />
				<ZoomOutButton />
				<ZoomResetButton />
			</div>
		</Draggable>
	);
};

export default ZoomOverlay;
