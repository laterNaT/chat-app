import { Form, useFetcher, useLoaderData, useLocation } from "react-router-dom";
import {
  getUsersNotFriended,
  sendFriendRequest,
} from "../services/friendService";
import "../styles/AddFriend.scss";

export async function loader({ request }: { request: Request }) {
  const url = new URL(request.url);
  const searchTerm = url.searchParams.get("username");
  if (!searchTerm) {
    return { users: [] };
  }
  const { data, error } = await getUsersNotFriended({ username: searchTerm });
  if (error) {
    console.log(error);
    return { users: [] };
  }
  return { users: data.users };
}

export async function action({ request }: { request: Request }) {
  const data = await request.formData();
  const username = data.get("username2") as string;
  try {
    if (!username) {
      return {
        success: false,
      };
    }
    const res = await sendFriendRequest({ username });
    if (!res.data) {
      return {
        success: false,
      };
    }
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
  const { users } = useLoaderData() as Awaited<ReturnType<typeof loader>>;
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
              <li className="results-item" key={user._id}>
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
