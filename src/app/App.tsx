import { useState, useEffect } from "react";
import {
  RoundCounts,
  getNBAPlayers,
  getNBATeams,
  getRoundCountForSelectedTeam,
} from "../functions/balldontlieApi";
import { NBATeam } from "@balldontlie/sdk";
import Form from "react-bootstrap/Form";
import { Alert, Button, Col, Row } from "react-bootstrap";
import "./App.css";

function App() {
  const [teams, setTeams] = useState<NBATeam[]>();
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedTeamName, setSelectedTeamName] = useState<string>("");
  const [roundCount, setRoundCount] = useState<string>("");
  const [errorPage, setErrorPage] = useState<boolean>(false);

  function SelectTeamDropdown(teams: Array<NBATeam>) {
    return (
      <Form.Select
        aria-label="Default select example"
        className="mb-2"
        id="teamInput"
      >
        <option>Select Team</option>
        {teams.map((team) => (
          <option value={team.id} key={team.id} id={team.id.toString()}>
            {team.full_name}
          </option>
        ))}
      </Form.Select>
    );
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formElements = form.elements as typeof form.elements & {
      teamInput: { value: number; innerHTML: string };
    };

    const teamId = formElements.teamInput.value;
    const teamPlayers = await getNBAPlayers({ teamId });

    let roundCounts: RoundCounts = {};
    if (teamPlayers.length) {
      roundCounts = getRoundCountForSelectedTeam({
        teamPlayers,
      });
    } else {
      setErrorPage(true);
    }

    if (Object.keys(roundCounts).length) {
      setRoundCount(JSON.stringify(roundCounts));
    }

    if (teamPlayers?.length) {
      setSelectedTeamName(teamPlayers[0].team.full_name);
    }
  }

  async function init() {
    const allTeams = await getNBATeams();

    if (allTeams.length) {
      console.log("got here2");
      setTeams(allTeams);
    } else {
      console.log("got here");
      setErrorPage(true);
    }

    console.log("got here3");

    setLoading(false);
  }

  useEffect(() => {
    if (loading) {
      init();
    }
  }, [loading]);

  return (
    <>
      {!loading ? (
        <>
          <h1>NBA Draft Tracker</h1>
          <div className="card">
            {!errorPage ? (
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
            ) : (
              <Alert variant="danger">
                <Alert.Heading>
                  Error: Too many attempts. Please try again after 1 minute.
                </Alert.Heading>
              </Alert>
            )}
          </div>
          <br />
          <div className="card content">
            <div>Team Name: {selectedTeamName}</div>
            <div>Draft Rounds: {roundCount}</div>
          </div>
        </>
      ) : (
        <div className="card">Loading...</div>
      )}
    </>
  );
}

export default App;
