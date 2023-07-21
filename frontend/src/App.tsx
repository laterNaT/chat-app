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
import PublicPage from "./pages/PublicPage";
import Root from "./pages/Root";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { session } = useAuthentication();
  if (!session) {
    return <Navigate to="/login" />;
  }
  return children;
};

const router = createBrowserRouter([
  {
    element: <Root />,
    children: [
      { path: "/", element: <PublicPage /> },
      { path: "/login", element: <Login /> },
      {
        path: "/home",
        element: (
          <ProtectedRoute>
            <ProtectedPage />
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
