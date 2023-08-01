import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Socket } from "socket.io-client";
import {
  ClientToServerEvents,
  Message,
  ServerToClientEvents,
} from "../../../backend/src/types/my_types/sockets";
import { useAuthentication } from "../context/AuthenticationContext";

export default function ConversationPage({
  socket,
}: {
  socket: Socket<ServerToClientEvents, ClientToServerEvents>;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState<string>("");
  const { username } = useAuthentication();
  const location = useLocation();
  const path = location.pathname.split("/")[3];

  useEffect(() => {
    socket.on("receiveMessage", (data: Message) => {
      setMessages((prev) => [...prev, data]);
    });

    socket.on("conversationHistory", (data: Message[]) => {
      setMessages([...data]);
    });

    return () => {
      socket.off("receiveMessage");
      socket.off("conversationHistory");
    };
  }, [socket]);

  useEffect(() => {
    socket.emit("joinConversation", path);
  }, [socket, path]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    socket.emit("sendMessage", {
      message: text,
      username: username!,
      room: path,
      date: new Date(),
    });
    setText("");
  };

  const formatDate = (date: Date): string => {
    return new Date(date).toLocaleString();
  };

  return (
    <div
      style={{
        width: "100%",
        position: "relative",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div style={{ overflowY: "scroll", height: "80vh" }}>
        {messages.map((message, index) => (
          <div key={index}>
            <p>
              {message.username === username ? "You" : message.username}:{" "}
              <span style={{ fontSize: "10px" }}>
                {formatDate(message.date)}
              </span>
            </p>
            <p>{message.message}</p>
          </div>
        ))}
      </div>
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          gap: "10px",
          marginTop: "16px",
          justifySelf: "flex-end",
        }}
      >
        <textarea
          style={{
            padding: "10px",
            fontSize: "16px",
            flexGrow: 1,
            borderRadius: "5px",
          }}
          onChange={(e) => setText(e.target.value)}
          value={text}
        />
        <button className="button" type="submit">
          Send
        </button>
      </form>
    </div>
  );
}
