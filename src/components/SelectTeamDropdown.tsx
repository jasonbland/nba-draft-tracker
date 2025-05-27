import Form from "react-bootstrap/Form";
import { NBATeam } from "@balldontlie/sdk";

export default function SelectTeamDropdown(teams: Array<NBATeam>) {
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
