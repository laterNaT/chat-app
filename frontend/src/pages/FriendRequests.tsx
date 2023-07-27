import { useFetcher, useLoaderData } from "react-router-dom";
import {
  acceptFriendRequest,
  getFriendRequests,
} from "../services/friendService";
import { TFetchPendingFriendRequestsResponse } from "../types/friendController";

export async function loader() {
  try {
    return await getFriendRequests();
  } catch (err) {
    console.log(err);
    return [];
  }
}

export async function action({ request }: { request: Request }) {
  const data = await request.formData();
  const username = data.get("username") as string;
  try {
    await acceptFriendRequest({ username: username });
    return {
      success: true,
    };
  } catch (err) {
    return {
      success: false,
    };
  }
}

export default function FriendRequests() {
  const { friendRequests } =
    useLoaderData() as TFetchPendingFriendRequestsResponse;
  const fetcher = useFetcher();
  // const success = useActionData();

  return (
    <>
      <h1>Friend requests</h1>
      <div>
        {friendRequests.map((friendRequest) => (
          <div key={friendRequest.id}>
            <div style={{ display: "flex", gap: "20px" }}>
              <p>{friendRequest.sender.username}</p>
              <fetcher.Form method="post">
                <input
                  type="hidden"
                  name="username"
                  value={friendRequest.sender.username}
                />
                <button className="button" type="submit">
                  Accept friend request
                </button>
              </fetcher.Form>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
