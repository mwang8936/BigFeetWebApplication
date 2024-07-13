import React from 'react';
import ReactDOM from 'react-dom/client';

import { I18nextProvider } from 'react-i18next';

import App from './App.tsx';
import ErrorBoundary from './ErrorBoundary.Component.tsx';
import './index.css';

import i18n from './utils/i18n.utils.ts';

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<ErrorBoundary>
			<I18nextProvider i18n={i18n}>
				<App />
			</I18nextProvider>
		</ErrorBoundary>
	</React.StrictMode>
);
