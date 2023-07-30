/**
 * This file was auto-generated by openapi-typescript.
 * Do not make direct changes to the file.
 */


export interface paths {
  "/api/users/register": {
    /** @description Register a new user */
    post: {
      requestBody: components["requestBodies"]["UserRegisterRequest"];
      responses: {
        /** @description User registered successfully */
        201: components["responses"]["GenericResponse"];
        /** @description User already exists */
        400: components["responses"]["GenericResponse"];
        /** @description Server error */
        500: components["responses"]["GenericResponse"];
      };
    };
  };
  "/api/users/login": {
    /** Login a user */
    post: {
      requestBody: components["requestBodies"]["UserLoginRequest"];
      responses: {
        /** @description User logged in successfully */
        200: components["responses"]["GenericResponse"];
        /** @description User does not exist */
        400: components["responses"]["GenericResponse"];
        /** @description Server error */
        500: components["responses"]["GenericResponse"];
      };
    };
  };
  "/api/users/logout": {
    /** Logout a user */
    delete: {
      responses: {
        /** @description User logged out successfully */
        200: components["responses"]["GenericResponse"];
        /** @description User does not exist */
        400: components["responses"]["GenericResponse"];
        /** @description Server error */
        500: components["responses"]["GenericResponse"];
      };
    };
  };
  "/api/users/search/{username}": {
    /** Search for a user */
    get: {
      parameters: {
        path: {
          /** @description Username of the user to search for */
          username: string;
        };
      };
      responses: {
        200: components["responses"]["SearchUserResponse"];
        /** @description User does not exist */
        400: components["responses"]["GenericResponse"];
        /** @description Server error */
        500: components["responses"]["GenericResponse"];
      };
    };
  };
  "/api/friends/requests/send": {
    /** Send a friend request */
    post: {
      requestBody: components["requestBodies"]["SendFriendRequestRequest"];
      responses: {
        /** @description Friend request sent successfully */
        200: components["responses"]["GenericResponse"];
        /** @description User does not exist */
        400: components["responses"]["GenericResponse"];
        /** @description Server error */
        500: components["responses"]["GenericResponse"];
      };
    };
  };
  "/api/friends/requests/accept": {
    /** Accept a friend request */
    post: {
      requestBody: components["requestBodies"]["SendFriendRequestRequest"];
      responses: {
        /** @description Friend request accepted successfully */
        200: components["responses"]["GenericResponse"];
        /** @description User does not exist */
        400: components["responses"]["GenericResponse"];
        /** @description Server error */
        500: components["responses"]["GenericResponse"];
      };
    };
  };
  "/api/friends/requests/decline": {
    /** Decline a friend request */
    post: {
      requestBody: components["requestBodies"]["DeclineFriendRequestRequest"];
      responses: {
        /** @description Friend request declined successfully */
        200: components["responses"]["GenericResponse"];
        /** @description User does not exist */
        400: components["responses"]["GenericResponse"];
        /** @description Server error */
        500: components["responses"]["GenericResponse"];
      };
    };
  };
  "/api/friends/requests/pending": {
    /** Get pending friend requests */
    get: {
      responses: {
        /** @description Friend requests retrieved successfully */
        200: components["responses"]["FriendRequestsResponse"];
        /** @description User does not exist */
        400: components["responses"]["GenericResponse"];
        /** @description Server error */
        500: components["responses"]["GenericResponse"];
      };
    };
  };
  "/api/friends/not-friended/{username}": {
    /** Get users that are not friends with the user */
    get: {
      parameters: {
        path: {
          /** @description Username of the user to search for */
          username: string;
        };
      };
      responses: {
        /** @description Users retrieved successfully */
        200: components["responses"]["SearchUsersNotFriendedResponse"];
        /** @description User does not exist */
        400: components["responses"]["GenericResponse"];
        /** @description Server error */
        500: components["responses"]["GenericResponse"];
      };
    };
  };
  "/api/friends/user": {
    /** Get friends of the user */
    get: {
      responses: {
        /** @description Friends retrieved successfully */
        200: components["responses"]["GetFriendsResponse"];
        /** @description User does not exist */
        400: components["responses"]["GenericResponse"];
        /** @description Server error */
        500: components["responses"]["GenericResponse"];
      };
    };
  };
}

export type webhooks = Record<string, never>;

export interface components {
  schemas: {
    User: {
      username?: string;
      _id?: string;
    };
    NewUser: {
      username: string;
      password: string;
    };
    UserWithStatus: {
      username: string;
      _id: string;
      status: string;
    };
    FriendRequest: {
      sender: {
        username?: string;
        _id?: string;
      };
      receiver: {
        username?: string;
        _id?: string;
      };
      status: string;
      _id: string;
    };
    GenericErrorModel: {
      message: string;
    };
  };
  responses: {
    /** @description User found */
    SearchUserResponse: {
      content: {
        "application/json": {
          users: components["schemas"]["User"][];
          message?: string;
        };
      };
    };
    /** @description Friend requests found */
    FriendRequestsResponse: {
      content: {
        "application/json": {
          friendRequests: components["schemas"]["FriendRequest"][];
          message?: string;
        };
      };
    };
    /** @description Users found */
    SearchUsersNotFriendedResponse: {
      content: {
        "application/json": {
          users: components["schemas"]["UserWithStatus"][];
          message?: string;
        };
      };
    };
    /** @description Friends found */
    GetFriendsResponse: {
      content: {
        "application/json": {
          friends: components["schemas"]["User"][];
          message?: string;
        };
      };
    };
    /** @description Generic response */
    GenericResponse: {
      content: {
        "application/json": {
          message: string;
        };
      };
    };
  };
  parameters: never;
  requestBodies: {
    UserRegisterRequest?: {
      content: {
        "application/json": {
          username: string;
          password: string;
        };
      };
    };
    UserLoginRequest?: {
      content: {
        "application/json": {
          username: string;
          password: string;
        };
      };
    };
    SendFriendRequestRequest?: {
      content: {
        "application/json": {
          username: string;
        };
      };
    };
    DeclineFriendRequestRequest?: {
      content: {
        "application/json": {
          id: string;
        };
      };
    };
  };
  headers: never;
  pathItems: never;
}

export type external = Record<string, never>;

export type operations = Record<string, never>;
