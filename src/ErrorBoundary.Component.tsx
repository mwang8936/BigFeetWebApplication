import React, { ReactNode, useEffect, useState } from 'react';

interface ErrorBoundaryProps {
	children: ReactNode;
}

const ErrorBoundary: React.FC<ErrorBoundaryProps> = ({ children }) => {
	const [hasError, setHasError] = useState(false);

	useEffect(() => {
		const errorHandler = (
			event: Event | string,
			source?: string,
			lineno?: number,
			colno?: number,
			error?: Error
		) => {
			setHasError(true);
			console.error('Error caught by error boundary:', error);
		};

		// Attach the error handler to the window's error event
		window.onerror = errorHandler;

		return () => {
			// Clean up on unmount
			window.onerror = null;
		};
	}, []);

	if (hasError) {
		return <div>Something went wrong!</div>;
	}

	return <>{children}</>;
};

export default ErrorBoundary;
