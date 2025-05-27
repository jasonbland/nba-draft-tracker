import React, { useState, useEffect } from "react";
import { getNBATeams } from "../functions/balldontlieApi";
import { NBATeam } from "@balldontlie/sdk";
import Form from "react-bootstrap/Form";
import { Button, Col, Row } from "react-bootstrap";
import "./App.css";

function App() {
  const [teams, setTeams] = useState<NBATeam[]>();
  const [loading, setLoading] = useState(true);

  async function init() {
    const allTeams = await getNBATeams();
    setTeams(allTeams);
    setLoading(false);
  }

  function SelectTeamDropdown(teams: Array<NBATeam>) {
    return (
      <Form.Select aria-label="Default select example" className="mb-2">
        <option>Select Team</option>
        {teams.map((team) => (
          <option value={team.id} key={team.id} id={team.id.toString()}>
            {team.full_name}
          </option>
        ))}
        <option value="1">One</option>
        <option value="2">Two</option>
        <option value="3">Three</option>
      </Form.Select>
    );
  }

  function SelectDraftRoundsDropdown() {
    return (
      <Form.Select aria-label="Default select example" className="mb-2">
        <option>Select Draft Rounds</option>
        <option value="1">One</option>
        <option value="2">Two</option>
        <option value="3">Three</option>
      </Form.Select>
    );
  }

  useEffect(() => {
    if (loading) {
      init();
    }
  }, [loading]);

  return (
    <>
      <h1>NBA Draft Tracker</h1>
      <div className="card">
        <Form>
          <Row className="align-items-center">
            <Col xs="auto">
              <Form.Label htmlFor="inlineFormInput" visuallyHidden>
                Teams
              </Form.Label>
              {teams && SelectTeamDropdown(teams)}
            </Col>
            <Col xs="auto">
              <Form.Label htmlFor="inlineFormInputGroup" visuallyHidden>
                Username
              </Form.Label>
              {SelectDraftRoundsDropdown()}
            </Col>
            <Col xs="auto">
              <Button type="submit" className="mb-2">
                Submit
              </Button>
            </Col>
          </Row>
        </Form>
      </div>
      <div className="card">
        {teams && (
          <table>
            <thead>
              <tr>
                <th scope="col">full_name</th>
                <th scope="col">abbreviation</th>
                <th scope="col">city</th>
                <th scope="col">conference</th>
                <th scope="col">division</th>
                <th scope="col">id</th>
                <th scope="col">name</th>
              </tr>
            </thead>
            <tbody>
              {teams.map((team) => (
                <tr key={team.id.toString()}>
                  <th>{team.full_name}</th>
                  <td>{team.abbreviation}</td>
                  <td>{team.city}</td>
                  <td>{team.conference}</td>
                  <td>{team.division}</td>
                  <td>{team.id}</td>
                  <td>{team.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <p className="read-the-docs">Click on the logos to learn more</p>
    </>
  );
}

export default App;
