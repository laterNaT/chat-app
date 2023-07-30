import { useLoaderData, useLocation, useNavigate } from "react-router-dom";
import { getFriends } from "../services/friendService";

export async function loader() {
  const { data, error } = await getFriends();
  if (error) {
    console.log(error);
    return { friends: [] };
  }
  const friends = data.friends;
  return { friends: friends };
}

export default function ManageFriendsPage() {
  const { friends } = useLoaderData() as Awaited<ReturnType<typeof loader>>;
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const handleFriendRequests = () => {
    navigate(`${pathname}/friend-requests`);
  };

  const handleAddNewFriend = () => {
    navigate(`${pathname}/add`);
  };

  return (
    <>
      <h1>Your friends</h1>
      <ul>
        {friends.map((friend) => (
          <li key={friend._id}>{friend.username}</li>
        ))}
      </ul>
      <div style={{ display: "flex", gap: "20px" }}>
        <button
          className="button"
          style={{ width: "200px" }}
          onClick={handleAddNewFriend}
        >
          Add new friend
        </button>
        <button
          className="button"
          style={{ width: "200px" }}
          onClick={handleFriendRequests}
        >
          Friend requests
        </button>
      </div>
    </>
  );
}
