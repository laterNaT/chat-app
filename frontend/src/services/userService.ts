import { TFindUsersGetResponse } from "../types/userController.d";

const getUsers = async ({
  username,
}: {
  username: string;
}): Promise<TFindUsersGetResponse | undefined> => {
  try {
    if (!username) throw new Error("No username");
    const res = await fetch("http://localhost:5000/api/users/" + username, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) {
      throw new Error("Error occured in fetch getUsers");
    }
    const resMsg = (await res.json()) as TFindUsersGetResponse;
    return resMsg;
  } catch (err) {
    console.log(err);
  }
};

export { getUsers };
