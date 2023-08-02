import { Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function RootPage() {
  return (
    <Container>
      <Row>
        <h1>Welcome</h1>
        <p>
          In this app you chat chat privatly with your friends or speak with
          strangers in global chat rooms.
        </p>
        <Link to="/login" style={{ textDecoration: "none" }}>
          Continue
        </Link>
      </Row>
    </Container>
  );
}
