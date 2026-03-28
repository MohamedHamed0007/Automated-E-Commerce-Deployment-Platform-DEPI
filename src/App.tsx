import { RouterProvider } from "react-router-dom";
import router from "./routes";
import { useAppSelector } from "./redux/hookredux";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";

function App() {
  const theme = useAppSelector((state) => state.theme.theme);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: theme === "dark" ? "#1f2937" : "#fff",
            color: theme === "dark" ? "#f9fafb" : "#111827",
          },
        }}
      />
      <RouterProvider router={router} />
    </>
  );
}

export default App;