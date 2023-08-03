import { Col, Container, Row } from "react-bootstrap";

export default function IndexPage() {
  return (
    <Container>
      <Row
        style={{ height: "calc(100vh - 56px)" }}
        className="align-items-center"
      >
        <Col xs={{ span: 8, offset: 2 }}>
          <p>
            Use the sidebar to the left to manage your friends list and
            conversations.
          </p>
        </Col>
      </Row>
    </Container>
  );
}
