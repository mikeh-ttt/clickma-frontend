import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { useEffect } from 'react';
import './App.css';
import AuthorizeScreen from './component/AuthorizeScreen';
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className='App'>
        <AuthorizeScreen
          client_id={import.meta.env.VITE_CLIENT_ID}
          client_secret={import.meta.env.VITE_CLIENT_SECRET}
          host={import.meta.env.VITE_BACKEND_URL}
        />
      </div>
    </QueryClientProvider>
  );
}

export default App;
