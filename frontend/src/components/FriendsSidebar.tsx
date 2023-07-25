type FriendsSidebarProps = {
  friends: string[];
};

export default function FriendsSidebar({ friends }: FriendsSidebarProps) {
  return (
    <div>
      {friends.length > 0 ? (
        friends.map((friend, index) => <div key={index}>{friend}</div>)
      ) : (
        <div>No friends</div>
      )}
    </div>
  );
}
