/* eslint-disable react-refresh/only-export-components */
import {
  Form,
  useActionData,
  useFetcher,
  useLoaderData,
  useLocation,
} from "react-router-dom";
import { getNonFriends, sendFriendRequest } from "../services/friendService";
import "../styles/AddFriend.scss";

type TUser = {
  username: string;
  id: number;
  status: "none" | "pending" | "accepted" | "rejected";
};

export async function loader({ request }: { request: Request }) {
  const url = new URL(request.url);
  const searchTerm = url.searchParams.get("username");
  if (!searchTerm) {
    return { users: [] };
  }
  return await getNonFriends({ username: searchTerm });
}

export async function action({ request }: { request: Request }) {
  const data = await request.formData();
  const username = data.get("username2");
  try {
    await sendFriendRequest({ username: username as string });
    return {
      success: true,
    };
  } catch (err) {
    console.log(err);
    return {
      success: false,
    };
  }
}

export default function AddFriend() {
  const { users } = useLoaderData() as { users: TUser[] };
  const success = useActionData();
  const fetcher = useFetcher();
  const { pathname } = useLocation();

  const styleBtn = (status: string) => {
    switch (status) {
      case "pending":
        return {
          backgroundColor: "lightblue",
        };
      case "accepted":
        return {
          backgroundColor: "green",
        };
      default:
        return {};
    }
  };

  return (
    <>
      {success && <p>Friend request sent!</p>}
      <Form
        className="search-form"
        method="get"
        action="/home/manage-friends/add"
      >
        <label className="form-label">
          <input className="form-input" type="text" name="username" />
        </label>
        <button className="button" type="submit">
          Search
        </button>
      </Form>
      {users.length > 0 ? (
        <>
          <h1 className="results-header">Search results</h1>
          <ul className="results-list">
            {users.map((user) => (
              <li className="results-item" key={user.id}>
                <p className="user-name">{user.username}</p>
                <fetcher.Form method="post" action={pathname}>
                  <button className="button" style={styleBtn(user.status)}>
                    {user.status === "none" ? "add" : user.status}
                  </button>
                  <input type="hidden" name="username2" value={user.username} />
                </fetcher.Form>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <div className="search-prompt">Enter a username to start searching</div>
      )}
    </>
  );
}
