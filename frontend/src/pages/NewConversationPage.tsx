import { useActionData, useFetcher, useLoaderData } from "react-router-dom";
import { createConversation } from "../services/conversationService";
import { getFriends } from "../services/friendService";

export async function loader() {
  const { data, error } = await getFriends();
  if (error) {
    console.log(error);
    return { friends: [] };
  }
  return { friends: data.friends };
}

//todo: this should redirect to the new conversation
export async function action({ request }: { request: Request }) {
  try {
    const formdata = await request.formData();
    const data = Object.fromEntries(formdata.entries());
    const participants = Object.keys(data).filter((key) => data[key] === "on");
    const conversationName = data.conversationName as string;
    return await createConversation({ conversationName, participants });
  } catch (err) {
    console.log(err);
    return "";
  }
}

export default function NewConversationPage() {
  const { friends } = useLoaderData() as Awaited<ReturnType<typeof loader>>;
  const data = useActionData();
  const fetcher = useFetcher();
  console.log(data);

  return (
    <>
      <h1>Create a new conversation</h1>
      <p>Select friends to add to the conversation below</p>
      {/* render list of friends with check box to select friends to add to conversation */}
      <fetcher.Form method="post" action="/home/new-conversation">
        <input type="text" name="conversationName" />
        <ul style={{ listStyle: "none" }}>
          {friends.map((friend) => (
            <li key={friend._id}>
              <input name={friend._id} type="checkbox" />
              {friend.username}
            </li>
          ))}
        </ul>
        <button className="button">Create conversation</button>
      </fetcher.Form>
    </>
  );
}
