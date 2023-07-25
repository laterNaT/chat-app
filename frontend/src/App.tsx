import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import {
  AuthenticationContextProvider,
  useAuthentication,
} from "./context/AuthenticationContext";
import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import ManageFriends from "./pages/ManageFriends";
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
        <HomePage />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "/home/manage-friends",
        element: (
          <ProtectedRoute>
            <ManageFriends />
          </ProtectedRoute>
        ),
      },
    ],
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
