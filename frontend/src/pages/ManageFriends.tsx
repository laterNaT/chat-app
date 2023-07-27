import { useLoaderData, useLocation, useNavigate } from "react-router-dom";
import { getFriends } from "../services/friendService";
import { TGetUserFriendsResponse } from "../types/friendController";

export async function loader() {
  const friends = await getFriends();
  if (!friends) {
    return { friends: [] };
  }
  return friends;
}

export default function ManageFriends() {
  const { friends } = useLoaderData() as TGetUserFriendsResponse;
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
