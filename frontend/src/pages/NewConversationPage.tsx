import {
  Button,
  Card,
  Col,
  Container,
  Form,
  ListGroup,
  Row,
} from "react-bootstrap";
import { useActionData, useFetcher, useLoaderData } from "react-router-dom";
import { createConversation } from "../services/conversationService";
import { getFriends } from "../services/friendService";

export async function loader() {
  const { data, error } = await getFriends();
  if (error) {
    console.log(error);
    return { friends: [] };
  }
  return { friends: data.friends };
}

//todo: this should redirect to the new conversation
export async function action({ request }: { request: Request }) {
  try {
    const formdata = await request.formData();
    const data = Object.fromEntries(formdata.entries());
    const participants = Object.keys(data).filter((key) => data[key] === "on");
    const conversationName = data.conversationName as string;
    return await createConversation({ conversationName, participants });
  } catch (err) {
    console.log(err);
    return null;
  }
}

export default function NewConversationPage() {
  const { friends } = useLoaderData() as Awaited<ReturnType<typeof loader>>;
  const data = useActionData();
  const fetcher = useFetcher();
  console.log(data);

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
