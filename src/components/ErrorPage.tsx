import { Alert } from "react-bootstrap";

export default function ErrorPage(message: string) {
  return (
    <Alert variant="danger">
      <Alert.Heading>{message}</Alert.Heading>
    </Alert>
  );
}
