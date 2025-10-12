import { Toaster } from "react-hot-toast";
import { AppRouter } from "./routes";

function App() {
  return (
    <>
      <AppRouter />
      <Toaster
        position="bottom-right"
        toastOptions={{ duration: 3500, className: "react-hot-toast" }}
      />
    </>
  );
}

export default App;
