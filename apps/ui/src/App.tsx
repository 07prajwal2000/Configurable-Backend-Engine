import { Toaster } from "react-hot-toast";
import { RouterProvider } from "react-router-dom";
import { browserRoutes } from "./routes";

function App() {
  return (
    <>
      <RouterProvider router={browserRoutes} />
      <Toaster
        position="bottom-right"
        toastOptions={{ duration: 3500, className: "react-hot-toast" }}
      />
    </>
  );
}

export default App;
