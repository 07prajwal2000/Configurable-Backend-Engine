import { Toaster } from "react-hot-toast";
import Editor from "./pages/editor";

function App() {
  return (
    <>
      <Editor />
      <Toaster
        position="bottom-right"
        toastOptions={{ duration: 3500, className: "react-hot-toast" }}
      />
    </>
  );
}

export default App;
