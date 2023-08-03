import {
  Form as BootstrapForm,
  Button,
  Card,
  Col,
  Container,
  ListGroup,
  Row,
} from "react-bootstrap";
import { Form, useFetcher, useLoaderData, useLocation } from "react-router-dom";

import {
  getUsersNotFriended,
  sendFriendRequest,
} from "../services/friendService";

export async function loader({ request }: { request: Request }) {
  const url = new URL(request.url);
  const searchTerm = url.searchParams.get("username");
  if (!searchTerm) {
    return { users: [] };
  }
  const { data, error } = await getUsersNotFriended({ username: searchTerm });
  if (error) {
    return { users: [] };
  }

  if (data.users.length === 0) {
    return { users: [], usersFound: false };
  }
  return { users: data.users, usersFound: true };
}

export async function action({ request }: { request: Request }) {
  const data = await request.formData();
  const username = data.get("username2") as string;
  try {
    return await sendFriendRequest({ username });
  } catch (err) {
    return null;
  }
}

export default function AddFriendPage() {
  const { users, usersFound } = useLoaderData() as Awaited<
    ReturnType<typeof loader>
  >;
  const fetcher = useFetcher();
  const { pathname } = useLocation();

  return (
    <Container className="mt-5" fluid>
      <Row className="justify-content-center">
        <Col xs={12} sm={10} md={8} lg={6}>
          <Card>
            <Card.Body>
              <Card.Title className="mb-4 text-center">Add a Friend</Card.Title>
              <Form method="get" action="/home/manage-friends/add">
                <BootstrapForm.Group className="mb-3">
                  <BootstrapForm.Control
                    type="text"
                    name="username"
                    placeholder="Enter username to search"
                    required
                  />
                </BootstrapForm.Group>
                <Button variant="primary" type="submit" className="mb-3 w-100">
                  Search
                </Button>
              </Form>
              {users.length > 0 && (
                <>
                  <Card.Title>Search results</Card.Title>
                  <ListGroup variant="flush">
                    {users.map((user) => (
                      <ListGroup.Item key={user._id}>
                        <Row>
                          <Col>{user.username}</Col>
                          <Col>
                            <fetcher.Form method="post" action={pathname}>
                              <Button
                                variant={
                                  user.status === "none"
                                    ? "primary"
                                    : "secondary"
                                }
                                className="float-end"
                                type="submit"
                              >
                                {user.status === "none" ? "Add" : user.status}
                              </Button>
                              <input
                                type="hidden"
                                name="username2"
                                value={user.username}
                              />
                            </fetcher.Form>
                          </Col>
                        </Row>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </>
              )}
              {usersFound === false && (
                <p className="text-center text-danger">
                  No users found matching your search term.
                </p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
