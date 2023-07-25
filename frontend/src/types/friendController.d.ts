export type TRegisterUserPostResponse = {
  message: string;
};

export type TLoginUserPostResponse = {
  message: string;
  session: string;
};

export type TLogoutUserDeleteResponse = {
  message: string;
};

export type TFindUsersGetResponse = {
  message: string;
  users: {
    username: string;
    id: string;
  }[];
};

export type TGetFriendsGetResponse = {
  message: string;
  friends: string[];
};
