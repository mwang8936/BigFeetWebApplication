// src/components/CustomCarousel.tsx
import React, { FC, useEffect, useState } from 'react';

interface CarouselProps {
	items: React.ReactNode[]; // Accepts an array of React nodes for carousel items
}

const Carousel: FC<CarouselProps> = ({ items }) => {
	const [currentIndex, setCurrentIndex] = useState(0);

	useEffect(() => {
		if (currentIndex > items.length - 1) {
			setCurrentIndex(items.length - 1);
		}
	}, [items.length]);

	const goToPrevious = () => {
		setCurrentIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : prevIndex));
	};

	const goToNext = () => {
		setCurrentIndex((prevIndex) =>
			prevIndex < items.length - 1 ? prevIndex + 1 : prevIndex
		);
	};

	return (
		<div className="relative w-full mx-auto">
			{/* Dots on Top */}
			<div className="flex justify-center mb-2">
				{items.map((_, index) => (
					<div
						key={index}
						className={`cursor-pointer w-3 h-3 mx-1 rounded-full ${
							index === currentIndex ? 'bg-blue-600' : 'bg-gray-300'
						}`}
						onClick={() => setCurrentIndex(index)} // Allow jumping to specific slide on dot click
					/>
				))}
			</div>

			<div className="flex justify-between items-center">
				{/* Disable left arrow if at first item */}
				<button
					onClick={goToPrevious}
					className={`absolute left-0 z-10 p-2 bg-gray-600 text-white rounded ${
						currentIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''
					}`}
					disabled={currentIndex === 0} // Disable button
				>
					&#10094; {/* Left arrow */}
				</button>

				<div className="overflow-hidden w-full">
					<div
						className="flex transition-transform duration-500"
						style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
						{items.map((item, index) => (
							<div key={index} className="w-full flex-shrink-0 px-8">
								{item}
							</div>
						))}
					</div>
				</div>

				{/* Disable right arrow if at last item */}
				<button
					onClick={goToNext}
					className={`absolute right-0 z-10 p-2 bg-gray-600 text-white rounded ${
						currentIndex === items.length - 1
							? 'opacity-50 cursor-not-allowed'
							: ''
					}`}
					disabled={currentIndex === items.length - 1} // Disable button
				>
					&#10095; {/* Right arrow */}
				</button>
			</div>
		</div>
	);
};

export default Carousel;
