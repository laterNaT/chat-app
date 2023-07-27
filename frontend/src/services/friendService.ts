import {
  TAcceptFriendRequestResponse,
  TFetchPendingFriendRequestsResponse,
  TFindUsersNotFriendedResponse,
  TGetUserFriendsResponse,
  TSendFriendRequestResponse,
} from "../types/friendController";

const getFriends = async (): Promise<TGetUserFriendsResponse | undefined> => {
  try {
    const res = await fetch("http://localhost:5000/api/friends/user", {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) {
      throw new Error("Error occured in fetch getFriends");
    }
    const resMsg = (await res.json()) as TGetUserFriendsResponse;
    return resMsg;
  } catch (err) {
    console.log(err);
  }
};

const getFriendRequests = async (): Promise<
  TFetchPendingFriendRequestsResponse | undefined
> => {
  try {
    const res = await fetch(
      "http://localhost:5000/api/friends/requests/pending",
      {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (!res.ok) {
      throw new Error("Error occured in fetch getFriendRequests");
    }
    const resMsg = (await res.json()) as TFetchPendingFriendRequestsResponse;
    return resMsg;
  } catch (err) {
    console.log(err);
  }
};

const sendFriendRequest = async ({
  username,
}: {
  username: string;
}): Promise<TSendFriendRequestResponse | undefined> => {
  try {
    if (!username) throw new Error("No username");
    const res = await fetch("http://localhost:5000/api/friends/requests/send", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username }),
    });
    if (!res.ok) {
      throw new Error("Error occured in fetch sendFriendRequest");
    }
    const resMsg = (await res.json()) as TSendFriendRequestResponse;
    return resMsg;
  } catch (err) {
    console.log(err);
  }
};

const acceptFriendRequest = async ({
  username,
}: {
  username: string;
}): Promise<TAcceptFriendRequestResponse | undefined> => {
  try {
    if (!username) throw new Error("No username");
    const res = await fetch(
      "http://localhost:5000/api/friends/requests/accept",
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username }),
      }
    );
    if (!res.ok) {
      throw new Error("Error occured in fetch sendFriendRequest");
    }
    const resMsg = (await res.json()) as TAcceptFriendRequestResponse;
    return resMsg;
  } catch (err) {
    console.log(err);
  }
};

const getNonFriends = async ({
  username,
}: {
  username: string;
}): Promise<TFindUsersNotFriendedResponse | undefined> => {
  try {
    if (!username) throw new Error("No username");
    const res = await fetch(
      `http://localhost:5000/api/friends/not-friended/${username}`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (!res.ok) {
      throw new Error("Error occured in fetch sendFriendRequest");
    }
    const resMsg = (await res.json()) as TFindUsersNotFriendedResponse;
    return resMsg;
  } catch (err) {
    console.log(err);
  }
};

export {
  acceptFriendRequest,
  getFriendRequests,
  getFriends,
  getNonFriends,
  sendFriendRequest,
};
