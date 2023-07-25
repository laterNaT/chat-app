import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import {
  AuthenticationContextProvider,
  useAuthentication,
} from "./context/AuthenticationContext";
import Login from "./pages/Login";
import ProtectedPage from "./pages/ProtectedPage";
import Root from "./pages/Root";
import "./styles/Global.scss";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { session } = useAuthentication();
  if (!session) {
    return <Navigate to="/login" />;
  }
  return children;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/home",
    element: (
      <ProtectedRoute>
        <ProtectedPage />
      </ProtectedRoute>
    ),
  },
]);

function App() {
  return (
    <AuthenticationContextProvider>
      <RouterProvider router={router} />
    </AuthenticationContextProvider>
  );
}

export default App;
