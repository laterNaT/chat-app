import { useFetcher, useLoaderData } from "react-router-dom";
import {
  acceptFriendRequest,
  getFriendRequests,
} from "../services/friendService";

export async function loader() {
  const { error, data } = await getFriendRequests();
  if (error) {
    console.log(error);
    return { friendRequests: [] };
  }
  return { friendRequests: data.friendRequests };
}

export async function action({ request }: { request: Request }) {
  const data = await request.formData();
  const username = data.get("username") as string;
  const { error } = await acceptFriendRequest({ username: username });
  if (error) {
    return {
      success: false,
    };
  }
  return {
    success: true,
  };
}

export default function FriendRequestsPage() {
  const { friendRequests } = useLoaderData() as Awaited<
    ReturnType<typeof loader>
  >;
  const fetcher = useFetcher();

  return (
    <>
      <h1>Friend requests</h1>
      <div>
        {friendRequests.map((friendRequest) => (
          <div key={friendRequest._id}>
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
