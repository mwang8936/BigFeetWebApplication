import { FC } from 'react';
import Draggable from 'react-draggable';

import {
	MagnifyingGlassPlusIcon,
	MagnifyingGlassMinusIcon,
	MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';

interface ZoomOverlayProp {
	zoomIn(): void;
	zoomOut(): void;
	zoomReset(): void;
}

const ZoomOverlay: FC<ZoomOverlayProp> = ({ zoomIn, zoomOut, zoomReset }) => {
	const ZoomInButton = () => {
		return (
			<button className="opacity-icon" onClick={zoomIn}>
				<MagnifyingGlassPlusIcon
					className="h-8 w-8 text-black"
					aria-hidden="true"
				/>
			</button>
		);
	};

	const ZoomOutButton = () => {
		return (
			<button className="opacity-icon" onClick={zoomOut}>
				<MagnifyingGlassMinusIcon
					className="h-8 w-8 text-black"
					aria-hidden="true"
				/>
			</button>
		);
	};

	const ZoomResetButton = () => {
		return (
			<button className="opacity-icon" onClick={zoomReset}>
				<MagnifyingGlassIcon
					className="h-8 w-8 text-black"
					aria-hidden="true"
				/>
			</button>
		);
	};
	return (
		<Draggable axis="y" bounds="parent">
			<div className="zoom-overlay-div">
				<ZoomInButton />
				<ZoomOutButton />
				<ZoomResetButton />
			</div>
		</Draggable>
	);
};

export default ZoomOverlay;
