import { Navigate } from "react-router-dom";
import { Socket, io } from "socket.io-client";
import {
  ClientToServerEvents,
  ServerToClientEvents,
} from "../../../backend/src/types/my_types/sockets";
import { useAuthentication } from "../context/AuthenticationContext";
import AddFriendPage, {
  action as addFriendAction,
  loader as addFriendLoader,
} from "../pages/AddFriendPage";
import ConversationPage from "../pages/ConversationPage";
import ErrorPage from "../pages/ErrorPage";
import FriendRequestsPage, {
  action as friendRequestsAction,
  loader as friendRequestsLoader,
} from "../pages/FriendRequestsPage";
import HomePage, { loader as homePageLoader } from "../pages/HomePage";
import IndexPage from "../pages/IndexPage";
import LoginPage from "../pages/LoginPage";
import ManageFriendsPage, {
  loader as manageFriendsLoader,
} from "../pages/ManageFriendsPage";
import NewConversationPage, {
  action as newConversationAction,
  loader as newConversationLoader,
} from "../pages/NewConversationPage";
import RegisterPage from "../pages/RegisterPage";
import RootPage from "../pages/RootPage";

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

const routesConfig = [
  {
    path: "/",
    element: <RootPage />,
    errorElement: <ErrorPage />,
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
        index: true,
        element: (
          <ProtectedRoute>
            <IndexPage />
          </ProtectedRoute>
        ),
      },
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
];

export { routesConfig };
