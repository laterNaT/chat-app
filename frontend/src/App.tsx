import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import {
  AuthenticationContextProvider,
  useAuthentication,
} from "./context/AuthenticationContext";
import AddFriendPage, {
  action as addFriendAction,
  loader as addFriendLoader,
} from "./pages/AddFriendPage";
import FriendRequestsPage, {
  action as friendRequestsAction,
  loader as friendRequestsLoader,
} from "./pages/FriendRequestsPage";
import HomePage, { loader as homePageLoader } from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import ManageFriendsPage, {
  loader as manageFriendsLoader,
} from "./pages/ManageFriendsPage";
import NewConversationPage, {
  action as newConversationAction,
  loader as newConversationLoader,
} from "./pages/NewConversationPage";
import RegisterPage from "./pages/RegisterPage";
import RootPage from "./pages/RootPage";
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
    element: <RootPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/home",
    loader: homePageLoader,
    element: (
      <ProtectedRoute>
        <HomePage />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "manage-friends",
        loader: manageFriendsLoader,
        element: (
          <ProtectedRoute>
            <ManageFriendsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "manage-friends/friend-requests",
        loader: friendRequestsLoader,
        action: friendRequestsAction,
        element: (
          <ProtectedRoute>
            <FriendRequestsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "manage-friends/add",
        loader: addFriendLoader,
        action: addFriendAction,
        element: (
          <ProtectedRoute>
            <AddFriendPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "new-conversation",
        loader: newConversationLoader,
        action: newConversationAction,
        element: (
          <ProtectedRoute>
            <NewConversationPage />
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
