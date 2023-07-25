import { useEffect, useState } from "react";
import "../styles/Sidebar.scss";
import { TGetFriendsGetResponse } from "../types/friendController";
import FriendsSidebar from "./FriendsSidebar";
import RoomsSidebar from "./RoomsSidebar";

export default function Sidebar() {
  const [showFriends, setShowFriends] = useState(true);
  const [friends, setFriends] = useState<string[]>([]);

  useEffect(() => {
    const getFriends = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/users/friends", {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!res.ok) {
          throw new Error("Error occured in fetch getFriends");
        }
        const resMsg = (await res.json()) as TGetFriendsGetResponse;
        setFriends(resMsg.friends);
      } catch (err) {
        console.log(err);
      }
    };
    getFriends().catch((err) => console.log(err));
  }, []);

  return (
    <div className="sidebar">
      <button className="button" onClick={() => setShowFriends(!showFriends)}>
        Show {showFriends ? "Rooms" : "Friends"}
      </button>
      {showFriends ? <FriendsSidebar friends={friends} /> : <RoomsSidebar />}
    </div>
  );
}
