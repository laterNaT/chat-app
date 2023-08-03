import { Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function RootPage() {
  return (
    <Container
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight: "100vh" }}
    >
      <Row>
        <Col xs={12}>
          <h1>Welcome</h1>
        </Col>
        <Col>
          <p>
            In this app you chat chat privatly with your friends or speak with
            strangers in global chat rooms.
          </p>
          <Link to="/login" style={{ textDecoration: "none" }}>
            Continue
          </Link>
        </Col>
      </Row>
    </Container>
  );
}
