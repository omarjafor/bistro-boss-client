import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { RouterProvider } from "react-router-dom";
import Router from './Routes/Router';
import { HelmetProvider } from 'react-helmet-async';
import AuthProviders from './Providers/AuthProviders';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProviders>
        <HelmetProvider>
          <RouterProvider router={Router} />
        </HelmetProvider>
      </AuthProviders>
    </QueryClientProvider>
  </React.StrictMode >,
)