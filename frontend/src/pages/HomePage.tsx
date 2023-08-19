import { Col, Container, Row } from "react-bootstrap";
import { Outlet, useLoaderData } from "react-router-dom";
import { Socket } from "socket.io-client";
import Sidebar, { TConversations } from "../components/Sidebar";
import TopNavBar from "../components/TopNavBar";
import { useSocketConnection } from "../hooks/useSocketConnection";
import { getConversations } from "../services/conversationService";

export async function loader() {
  try {
    const res = await getConversations();
    return res.conversations;
  } catch (err) {
    return [];
  }
}

export default function HomePage({ socket }: { socket: Socket }) {
  const conversations = useLoaderData() as TConversations;

  useSocketConnection(socket);

  return (
    <Container fluid style={{ padding: "0px" }}>
      <TopNavBar socket={socket} />
      <Row>
        <Col
          xs={3}
          md={2}
          style={{ height: "calc(100vh - 56px)", overflowY: "scroll" }}
          className="bg-light"
        >
          <Sidebar conversations={conversations} />
        </Col>
        <Col xs={9} md={10} style={{ height: "100vh" }}>
          <Outlet />
        </Col>
      </Row>
    </Container>
  );
}
