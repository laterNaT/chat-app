import "bootstrap/dist/css/bootstrap.min.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { routesConfig } from "./config/routesConfig";
import { AuthenticationContextProvider } from "./context/AuthenticationContext";
import "./styles/Global.scss";

const router = createBrowserRouter(routesConfig);

function App() {
  return (
    <AuthenticationContextProvider>
      <RouterProvider router={router} />
    </AuthenticationContextProvider>
  );
}

export default App;
