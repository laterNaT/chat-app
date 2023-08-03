import {
  Button,
  Card,
  Col,
  Container,
  Form,
  ListGroup,
  Row,
} from "react-bootstrap";
import { redirect, useFetcher, useLoaderData } from "react-router-dom";
import { createConversation } from "../services/conversationService";
import { getFriends } from "../services/friendService";

export async function loader() {
  const { data, error } = await getFriends();
  if (error) {
    return { friends: [] };
  }
  return { friends: data.friends };
}

export async function action({ request }: { request: Request }) {
  try {
    const formdata = await request.formData();
    const data = Object.fromEntries(formdata.entries());
    const participants = Object.keys(data).filter((key) => data[key] === "on");
    const conversationName = data.conversationName as string;
    const res = await createConversation({ conversationName, participants });
    const id = res.conversationId;
    return redirect(`/home/conversations/${id}`);
  } catch (err) {
    return null;
  }
}

export default function NewConversationPage() {
  const { friends } = useLoaderData() as Awaited<ReturnType<typeof loader>>;
  const fetcher = useFetcher();

  return (
    <Container className="mt-5" fluid>
      <Row className="justify-content-center">
        <Col xs={12} sm={10} md={8} lg={6}>
          <Card>
            <Card.Body>
              <Card.Title className="mb-4 text-center">
                Create a new conversation
              </Card.Title>
              <fetcher.Form method="post" action="/home/new-conversation">
                <Form.Group className="mb-3">
                  <Form.Label>Conversation Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="conversationName"
                    placeholder="Enter conversation name"
                    required
                  />
                </Form.Group>
                <Form.Label>
                  Select friends to add to the conversation:
                </Form.Label>
                <ListGroup variant="flush">
                  {friends.map((friend) => (
                    <ListGroup.Item key={friend._id}>
                      <Form.Check
                        id={friend._id}
                        name={friend._id}
                        label={friend.username}
                      />
                    </ListGroup.Item>
                  ))}
                </ListGroup>
                <Button variant="primary" type="submit" className="mt-3 w-100">
                  Create conversation
                </Button>
              </fetcher.Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
