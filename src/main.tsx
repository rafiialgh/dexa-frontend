import { StrictMode } from 'react'
import { TooltipProvider } from './components/ui/tooltip'
import { createRoot } from 'react-dom/client'
import './index.css'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { Toaster } from 'sonner';
import { Provider } from 'react-redux';
import { store } from './store/index.ts';

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <TooltipProvider>
          <ReactQueryDevtools />
          <Toaster richColors position='top-right' closeButton />
          <RouterProvider router={router} />
        </TooltipProvider>
      </Provider>
    </QueryClientProvider>
  </StrictMode>,
)
