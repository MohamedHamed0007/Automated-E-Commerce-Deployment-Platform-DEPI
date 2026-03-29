import { RouterProvider } from 'react-router';
import { router } from './routes';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            borderRadius: "10px",
            background: "blue",
            color: "#fff",
          },
        }}
      />

      <RouterProvider router={router} />
    </>
  );
}

export default App;