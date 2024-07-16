import { MantineProvider, createTheme } from '@mantine/core';
import '@mantine/core/styles.css';
import { ModalsProvider } from '@mantine/modals';
import { GoogleOAuthProvider } from '@react-oauth/google';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false,
		},
	},
});
const theme = createTheme({
	fontFamily: 'Inter, sans-serif',
	defaultRadius: 'sm',
	cursorType: 'pointer',
	defaultGradient: {
		from: 'blue',
		to: 'purple',
		deg: 45,
	},

	colors: {
		appBlue: [
			'#e8f6ff',
			'#d3e8fc',
			'#a5cff6',
			'#74b4f1',
			'#4d9ded',
			'#368fec',
			'#2988ec',
			'#1b75d3',
			'#0d68bd',
			'#1B5293',
		],
	},
	primaryColor: 'appBlue',
	primaryShade: 9,
	breakpoints: {
		xs: '36em',
		sm: '48em',
		md: '62em',
		lg: '75em',
		xl: '88em',
	},
});

ReactDOM.createRoot(document.getElementById('root')).render(
	<MantineProvider theme={theme}>
		<ModalsProvider>
			<GoogleOAuthProvider clientId="375628380908-1p1h6mtffidanbrb2rksfs76jnglfodo.apps.googleusercontent.com">
				<QueryClientProvider client={queryClient}>
					<BrowserRouter>
						<App />
					</BrowserRouter>
				</QueryClientProvider>
			</GoogleOAuthProvider>
		</ModalsProvider>
	</MantineProvider>
);
