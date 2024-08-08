import React from 'react';
import ReactDOM from 'react-dom/client';
import { ErrorBoundary } from 'react-error-boundary';

import { I18nextProvider } from 'react-i18next';

import App from './App.tsx';
import ErrorFallback from './ErrorFallback.Component.tsx';
import './index.css';

import i18n from './utils/i18n.utils.ts';

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<ErrorBoundary
			FallbackComponent={ErrorFallback}
			onReset={() => window.location.reload()}
			onError={(error, errorInfo) =>
				console.error('Error caught by ErrorBoundary:', error, errorInfo)
			}>
			<I18nextProvider i18n={i18n}>
				<App />
			</I18nextProvider>
		</ErrorBoundary>
	</React.StrictMode>
);
