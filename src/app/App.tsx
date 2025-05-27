import { useState, useEffect } from "react";
import {
  RoundCounts,
  getNBAPlayers,
  getNBATeams,
  getRoundCountForSelectedTeam,
} from "../functions/balldontlieApi";
import { NBATeam } from "@balldontlie/sdk";

import SelectTeamDropdown from "../components/SelectTeamDropdown";
import ErrorPage from "../components/ErrorPage";
import DraftRoundCount from "../components/DraftRoundCount";
import NBATeamsForm from "../components/NBATeamsForm";

import "./App.css";

function App() {
  const [teams, setTeams] = useState<NBATeam[]>();
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedTeamName, setSelectedTeamName] = useState<string>("");
  const [roundCount, setRoundCount] = useState<string>("");
  const [errorPage, setErrorPage] = useState<boolean>(false);

  async function init() {
    const allTeams = await getNBATeams();
    if (allTeams.length) {
      setTeams(allTeams);
    } else {
      setErrorPage(true);
    }
    setLoading(false);
  }

  useEffect(() => {
    if (loading) {
      init();
    }
  }, [loading]);

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

  return (
    <>
      {!loading ? (
        <>
          <h1>NBA Draft Tracker</h1>
          <div className="card">
            {!errorPage
              ? NBATeamsForm({ handleSubmit, SelectTeamDropdown, teams })
              : ErrorPage(
                  "Error: Too many attempts. Please try again after 1 minute."
                )}
          </div>
          <br />
          <div className="card content">
            {DraftRoundCount({ selectedTeamName, roundCount })}
          </div>
        </>
      ) : (
        <div className="card">Loading...</div>
      )}
    </>
  );
}

export default App;
