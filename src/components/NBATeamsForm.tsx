import { FormEvent, ReactNode } from "react";
import { NBATeam } from "@balldontlie/sdk";
import { Button, Col, Form, Row } from "react-bootstrap";

type NBATeamsFormParams = {
  handleSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>;
  SelectTeamDropdown: (teams: Array<NBATeam>) => ReactNode;
  teams?: Array<NBATeam>;
};

export default function NBATeamsForm({
  handleSubmit,
  SelectTeamDropdown,
  teams,
}: NBATeamsFormParams) {
  return (
    <Form onSubmit={handleSubmit}>
      <Row className="align-items-center">
        <Col xs="auto">
          <Form.Label htmlFor="inlineFormInput" visuallyHidden>
            Teams
          </Form.Label>
          {teams && SelectTeamDropdown(teams)}
        </Col>
        <Col xs="auto">
          <Button type="submit" className="mb-2">
            Submit
          </Button>
        </Col>
      </Row>
    </Form>
  );
}
