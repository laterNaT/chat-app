// Response type for the registerUser handler
export type TRegisterUserPostResponse = {
  message: string;
};

// Response type for the loginUser handler
export type TLoginUserPostResponse = {
  message: string;
  session: string;
};

// Response type for the logoutUser handler
export type TLogoutUserDeleteResponse = {
  message: string;
};

// Response type for the searchUsers handler
export type TFindUsersGetResponse = {
  message: string;
  users: {
    username: string;
    id: string;
  }[];
};
