import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import {
  AuthenticationContextProvider,
  useAuthentication,
} from "./context/AuthenticationContext";
import AddFriend, {
  action as addFriendAction,
  loader as addFriendLoader,
} from "./pages/AddFriend";
import FriendRequests, {
  action as friendRequestsAction,
  loader as friendRequestsLoader,
} from "./pages/FriendRequests";
import HomePage, { loader as homePageLoader } from "./pages/HomePage";
import Login from "./pages/Login";
import ManageFriends, {
  loader as manageFriendsLoader,
} from "./pages/ManageFriends";
import NewConversation, {
  action as newConversationAction,
  loader as newConversationLoader,
} from "./pages/NewConversation";
import Register from "./pages/Register";
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
    path: "/register",
    element: <Register />,
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
            <ManageFriends />
          </ProtectedRoute>
        ),
      },
      {
        path: "manage-friends/friend-requests",
        loader: friendRequestsLoader,
        action: friendRequestsAction,
        element: (
          <ProtectedRoute>
            <FriendRequests />
          </ProtectedRoute>
        ),
      },
      {
        path: "manage-friends/add",
        loader: addFriendLoader,
        action: addFriendAction,
        element: (
          <ProtectedRoute>
            <AddFriend />
          </ProtectedRoute>
        ),
      },
      {
        path: "new-conversation",
        loader: newConversationLoader,
        action: newConversationAction,
        element: (
          <ProtectedRoute>
            <NewConversation />
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
