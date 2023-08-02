import { useEffect } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { Outlet, useLoaderData } from "react-router-dom";
import { Socket } from "socket.io-client";
import Sidebar, { TConversations } from "../components/Sidebar";
import TopNavBar from "../components/TopNavBar";
import { getConversations } from "../services/conversationService";

export async function loader() {
  try {
    const res = await getConversations();
    return res.conversations;
  } catch (err) {
    console.log(err);
    return [];
  }
}

export default function HomePage({ socket }: { socket: Socket }) {
  const conversations = useLoaderData() as TConversations;

  useEffect(() => {
    socket.connect();
    return () => {
      socket.disconnect();
    };
  }, [socket]);

  return (
    <Container fluid>
      <TopNavBar socket={socket} />
      <Row>
        <Col
          xs={3}
          md={2}
          style={{ height: "calc(100vh - 56px)", overflowY: "scroll" }}
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
