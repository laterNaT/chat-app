import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import { Socket, io } from "socket.io-client";
// import "../../backend/src/types/my_types/sockets";
import {
  ClientToServerEvents,
  ServerToClientEvents,
} from "../../backend/src/types/my_types/sockets";
import {
  AuthenticationContextProvider,
  useAuthentication,
} from "./context/AuthenticationContext";
import AddFriendPage, {
  action as addFriendAction,
  loader as addFriendLoader,
} from "./pages/AddFriendPage";
import ConversationPage from "./pages/ConversationPage";
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

const socketURL = "http://localhost:5000";

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
  socketURL,
  {
    autoConnect: false, // don't connect until user is authenticated
    withCredentials: true, // IMPORTANT
  }
);

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
        <HomePage socket={socket} />
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
      {
        path: "conversations/:conversationId",
        element: (
          <ProtectedRoute>
            <ConversationPage socket={socket} />
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
