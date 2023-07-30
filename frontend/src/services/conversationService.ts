const createConversation = async ({
  conversationName,
  participants,
}: {
  conversationName: string;
  participants: string[];
}) => {
  try {
    if (!conversationName || !participants) {
      throw new Error("No name or members");
    }
    const res = await fetch("http://localhost:5000/api/conversation/create", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        conversationName,
        participants,
      }),
    });
    if (!res.ok) {
      throw new Error("Error occured in fetch createConversation");
    }
    const resMsg = await res.json();
    console.log("CREATE CONVERSATION RES", res);
    return resMsg;
  } catch (err) {
    console.log(err);
  }
};

const getConversations = async () => {
  try {
    const res = await fetch("http://localhost:5000/api/conversation", {
      method: "GET",
      credentials: "include",
    });
    if (!res.ok) {
      throw new Error("Error occured in fetch getConversations");
    }
    const resMsg = await res.json();
    return resMsg;
  } catch (err) {
    console.log(err);
  }
};

export { createConversation, getConversations };
