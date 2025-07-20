import React, { FC, useEffect, useRef, useState } from 'react';

interface CarouselProps {
	items: React.ReactNode[];
}

const Carousel: FC<CarouselProps> = ({ items }) => {
	const [currentIndex, setCurrentIndex] = useState(0);
	const [containerHeight, setContainerHeight] = useState<number | undefined>(
		undefined
	);
	const containerRef = useRef<HTMLDivElement | null>(null);
	const currentItemRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		const measureHeight = () => {
			if (currentItemRef.current) {
				setContainerHeight(currentItemRef.current.offsetHeight);
			}
		};

		measureHeight();

		// Optional: observe height changes for dynamic content
		const resizeObserver = new ResizeObserver(measureHeight);
		if (currentItemRef.current) {
			resizeObserver.observe(currentItemRef.current);
		}

		return () => resizeObserver.disconnect();
	}, [currentIndex]);

	const goToPrevious = () => {
		setCurrentIndex((prev) => Math.max(0, prev - 1));
	};

	const goToNext = () => {
		setCurrentIndex((prev) => Math.min(items.length - 1, prev + 1));
	};

	return (
		<div
			ref={containerRef}
			className="relative w-full mx-auto transition-all duration-300"
			style={{ height: containerHeight }}
		>
			{/* Dots */}
			<div className="flex justify-center mb-2">
				{items.map((_, index) => (
					<div
						key={index}
						className={`cursor-pointer w-3 h-3 mx-1 rounded-full ${
							index === currentIndex ? 'bg-blue-600' : 'bg-gray-300'
						}`}
						onClick={() => setCurrentIndex(index)}
					/>
				))}
			</div>

			{/* Slide Container */}
			<div className="relative w-full">
				{items.map((item, index) => (
					<div
						key={index}
						ref={index === currentIndex ? currentItemRef : null}
						className={`absolute top-0 left-0 w-full transition-opacity duration-500 ${
							index === currentIndex
								? 'opacity-100 relative'
								: 'opacity-0 pointer-events-none'
						}`}
					>
						<div className="px-8">{item}</div>
					</div>
				))}
			</div>

			{/* Navigation Buttons */}
			<button
				onClick={goToPrevious}
				className={`absolute left-0 top-1/2 transform -translate-y-1/2 z-10 p-2 bg-gray-600 text-white rounded ${
					currentIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''
				}`}
				disabled={currentIndex === 0}
			>
				&#10094;
			</button>

			<button
				onClick={goToNext}
				className={`absolute right-0 top-1/2 transform -translate-y-1/2 z-10 p-2 bg-gray-600 text-white rounded ${
					currentIndex === items.length - 1
						? 'opacity-50 cursor-not-allowed'
						: ''
				}`}
				disabled={currentIndex === items.length - 1}
			>
				&#10095;
			</button>
		</div>
	);
};

export default Carousel;
