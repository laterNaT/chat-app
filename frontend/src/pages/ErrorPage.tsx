import { Col, Container, Row } from "react-bootstrap";
import { useRouteError } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError() as { statusText?: string; message?: string };
  return (
    <Container className="text-center" style={{ marginTop: "10rem" }}>
      <Row>
        <Col xs={12}>
          <h1>Error</h1>
        </Col>
        <Col xs={12}>
          <p>Something unexpected happend.</p>
        </Col>
        <Col>
          <p style={{ fontStyle: "italic" }}>
            {error.statusText || error.message}
          </p>
        </Col>
      </Row>
    </Container>
  );
}
