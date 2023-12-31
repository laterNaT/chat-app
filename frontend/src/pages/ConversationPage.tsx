import { useState } from "react";
import { Button, Col, Container, Form, InputGroup, Row } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import { Socket } from "socket.io-client";
import {
  ClientToServerEvents,
  ServerToClientEvents,
} from "../../../backend/src/types/my_types/sockets";
import { useAuthentication } from "../context/AuthenticationContext";
import { useSocketCommunication } from "../hooks/useSocketConversation";

export default function ConversationPage({
  socket,
}: {
  socket: Socket<ServerToClientEvents, ClientToServerEvents>;
}) {
  const [text, setText] = useState<string>("");
  const { username } = useAuthentication();
  const location = useLocation();
  const path = location.pathname.split("/")[3];
  const { messages, sendMessage } = useSocketCommunication(socket, path);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    sendMessage({
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
    <Container
      fluid
      style={{
        height: "calc(100vh - 80px)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Row className="mb-3 mt-3" style={{ overflowY: "scroll", flexGrow: 1 }}>
        <Col>
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
          {messages.length === 0 && (
            <div className="d-flex justify-content-center align-items-center h-100">
              <p>No messages in this conversation</p>
            </div>
          )}
        </Col>
      </Row>
      <Row>
        <Col>
          <Form onSubmit={handleSubmit}>
            <InputGroup>
              <Form.Control
                as="input"
                onChange={(e) => setText(e.target.value)}
                value={text}
              />
              <Button variant="primary" type="submit">
                Send
              </Button>
            </InputGroup>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}
