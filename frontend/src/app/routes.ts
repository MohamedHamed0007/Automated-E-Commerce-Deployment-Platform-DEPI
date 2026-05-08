import { createBrowserRouter } from 'react-router';
import { Layout } from './components/Layout';

import PaymentSuccess from './pages/PaymentSuccess';

import NotFound from './pages/NotFound';

export const router = createBrowserRouter([
  // Auth routes (no layout)

  // Main app routes (with layout)
  {
    path: '/',
    Component: Layout,
    children: [
   
      {
        path: 'payment/success',
        Component: PaymentSuccess,
      },
   
      {
        path: '*',
        Component: NotFound,
      },
    ],
  },
]);