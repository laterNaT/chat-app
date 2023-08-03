import { Button, Col, Container, InputGroup, Row } from "react-bootstrap";
import { useFetcher, useLoaderData } from "react-router-dom";
import {
  acceptFriendRequest,
  getFriendRequests,
} from "../services/friendService";

export async function loader() {
  const { error, data } = await getFriendRequests();
  if (error) {
    console.log(error);
    return { friendRequests: [] };
  }
  return { friendRequests: data.friendRequests };
}

export async function action({ request }: { request: Request }) {
  const data = await request.formData();
  const username = data.get("username") as string;
  const { error } = await acceptFriendRequest({ username: username });
  if (error) {
    return {
      success: false,
    };
  }
  return {
    success: true,
  };
}

export default function FriendRequestsPage() {
  const { friendRequests } = useLoaderData() as Awaited<
    ReturnType<typeof loader>
  >;
  const fetcher = useFetcher();

  return (
    <Container>
      <Row className="justify-content-center">
        <h1 className="text-center mb-4 mt-3">Friend Requests</h1>

        <Row>
          {friendRequests.map((friendRequest) => (
            <Col
              md={{ span: 6, offset: 3 }}
              key={friendRequest._id}
              className="mb-3"
            >
              <InputGroup className="justify-content-center">
                <Col xs={4}>
                  <InputGroup.Text>
                    {friendRequest.sender.username}
                  </InputGroup.Text>
                </Col>
                <fetcher.Form method="post">
                  <input
                    type="hidden"
                    name="username"
                    value={friendRequest.sender.username}
                  />
                  <Button variant="primary" type="submit" className="ms-1 me-1">
                    Accept
                  </Button>
                  <Button variant="danger" type="submit">
                    Decline
                  </Button>
                </fetcher.Form>
              </InputGroup>
            </Col>
          ))}
        </Row>
      </Row>
    </Container>
  );
}
