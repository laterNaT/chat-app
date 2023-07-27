export type TSendFriendRequestResponse = {
  message: string;
};

export type TAcceptFriendRequestResponse = {
  message: string;
};

export type TDeclineFriendRequestResponse = {
  message: string;
};

export type TFriendRequest = {
  id: string;
  sender: {
    _id: string;
    username: string;
  };
  receiver: {
    _id: string;
    username: string;
  };
  status: "pending" | "accepted" | "rejected";
};

export type TFetchPendingFriendRequestsResponse = {
  message: string;
  friendRequests: TFriendRequest[];
};

export type TUserNotFriended = {
  username: string;
  id: string;
  status: "none" | "pending" | "accepted" | "rejected";
};

export type TFindUsersNotFriendedResponse = {
  message: string;
  users: TUserNotFriended[];
};

export type TFriend = {
  _id: string;
  username: string;
};

export type TGetUserFriendsResponse = {
  message: string;
  friends: TFriend[]; // Array of friend objects with _id and username
};
