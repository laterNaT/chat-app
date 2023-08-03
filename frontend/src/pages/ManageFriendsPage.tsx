import { Button, Card, Col, Container, ListGroup, Row } from "react-bootstrap";
import { useLoaderData, useLocation, useNavigate } from "react-router-dom";
import { getFriends } from "../services/friendService";

export async function loader() {
  const { data, error } = await getFriends();
  if (error) {
    console.log(error);
    return { friends: [] };
  }
  const friends = data.friends;
  return { friends: friends };
}

export default function ManageFriendsPage() {
  const { friends } = useLoaderData() as Awaited<ReturnType<typeof loader>>;
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const handleFriendRequests = () => {
    navigate(`${pathname}/friend-requests`);
  };

  const handleAddNewFriend = () => {
    navigate(`${pathname}/add`);
  };

  return (
    <Container className="mt-5" fluid>
      <Row className="justify-content-center">
        <Col xs={12} sm={10} md={8} lg={6}>
          <Card>
            <Card.Body>
              <Card.Title className="mb-4 text-center">Your friends</Card.Title>
              <ListGroup variant="flush">
                {friends.map((friend) => (
                  <ListGroup.Item key={friend._id}>
                    {friend.username}
                  </ListGroup.Item>
                ))}
              </ListGroup>
              <div className="d-flex justify-content-center gap-2 mt-3">
                <Button variant="primary" onClick={handleAddNewFriend}>
                  Add new friend
                </Button>
                <Button variant="secondary" onClick={handleFriendRequests}>
                  Friend requests
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
