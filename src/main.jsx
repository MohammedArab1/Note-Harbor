import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';
import App from './App'
import { QueryClient, QueryClientProvider } from 'react-query'
import '@mantine/core/styles.css';
import { MantineProvider, createTheme } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';

// const theme = createTheme();
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false
    },
  },
})
const theme = createTheme({
  fontFamily: 'Inter, sans-serif',
  defaultRadius: 'sm',
  cursorType: 'pointer',
  defaultGradient: {
    from: 'blue',
    to: 'purple',
    deg: 45,
  },
  // ComboBox: {
  //   defaultProps: {
  //       popoverProps:{withinPortal: true}
  //   }
  // },
  colors: {
    'appBlue': [
      "#e8f6ff",
      "#d3e8fc",
      "#a5cff6",
      "#74b4f1",
      "#4d9ded",
      "#368fec",
      "#2988ec",
      "#1b75d3",
      "#0d68bd",
      "#1B5293"
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
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
              <App />
          </BrowserRouter>
        </QueryClientProvider>
    </ModalsProvider>
  </MantineProvider>
)
