import { useEffect, useState } from "react";
import { Alert, Button, Col, Container, Form, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useAuthentication } from "../context/AuthenticationContext";

export default function LoginPage() {
  const navigate = useNavigate();
  const { session } = useAuthentication();
  const { handleLogin } = useAuthentication();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const login = async () => {
    await handleLogin(username, password);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    login().catch((err: Error) => setError(err.message));
  };

  useEffect(() => {
    if (session) {
      navigate("/home");
    }
  }, [session, navigate]);

  return (
    <Container
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight: "100vh" }}
    >
      <Row>
        <Col md={{ offset: 3, span: 6 }}>
          <p className="h3"> Please sign in to continue.</p>
        </Col>
        <Col md={{ offset: 3, span: 6 }}>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formBasicUsername" className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your username"
                onChange={(e) => setUsername(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formBasicPassword" className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter your password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="mb-3">
              Login
            </Button>
            <Alert
              variant="danger"
              show={error !== ""}
              onClose={() => setError("")}
              dismissible
            >
              Error: {error}
            </Alert>
          </Form>
        </Col>
        <Col md={{ offset: 3, span: 6 }}>
          <p>
            No account? Register one <Link to="/register">here</Link>
          </p>
        </Col>
      </Row>
    </Container>
  );
}
