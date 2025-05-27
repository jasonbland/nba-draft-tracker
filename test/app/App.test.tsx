import App from "../../src/app/App";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import {
  getNBATeams,
  getNBAPlayers,
  getRoundCountForSelectedTeam,
} from "../../src/functions/balldontlieApi";
import { NBATeam, NBAPlayer } from "@balldontlie/sdk";

jest.mock("../../src/functions/balldontlieApi");

describe("App tests", () => {
  const mockTeams: NBATeam[] = [
    {
      id: 1,
      abbreviation: "ATL",
      city: "Atlanta",
      conference: "East",
      division: "Southeast",
      full_name: "Atlanta Hawks",
      name: "Hawks",
    },
    {
      id: 2,
      abbreviation: "BOS",
      city: "Boston",
      conference: "East",
      division: "Atlantic",
      full_name: "Boston Celtics",
      name: "Celtics",
    },
  ];

  const mockPlayers: NBAPlayer[] = [
    {
      id: 1,
      first_name: "Jayson",
      last_name: "Tatum",
      position: "F",
      height: "6-8",
      weight: "210",
      jersey_number: "0",
      college: "Duke",
      country: "USA",
      draft_year: 2017,
      draft_round: 1,
      draft_number: 3,
      team: mockTeams[1],
    },
    {
      id: 2,
      first_name: "Jaylen",
      last_name: "Brown",
      position: "G-F",
      height: "6-6",
      weight: "223",
      jersey_number: "7",
      college: "California",
      country: "USA",
      draft_year: 2016,
      draft_round: 1,
      draft_number: 3,
      team: mockTeams[1],
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (getRoundCountForSelectedTeam as jest.Mock).mockReturnValue({ "1": 2 });
  });

  it("should fetch and display teams in dropdown", async () => {
    (getNBATeams as jest.Mock).mockResolvedValue(mockTeams);
    render(<App />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();

    const selectElement = await screen.findByLabelText(
      "Default select example"
    );
    const buttonElement = await screen.findByTestId("submitButton");

    expect(selectElement).toBeInTheDocument();
    expect(buttonElement).toBeInTheDocument();
    expect(getNBATeams).toHaveBeenCalledTimes(1);
    expect(screen.getByText("Atlanta Hawks")).toBeInTheDocument();
    expect(screen.getByText("Boston Celtics")).toBeInTheDocument();
  });

  it("should display error message on balldontlie api error when page loads", async () => {
    (getNBATeams as jest.Mock).mockResolvedValue([]);
    render(<App />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();

    const errorPageMessage = await screen.findByText(
      "Error: Too many attempts. Please try again after 1 minute."
    );

    expect(errorPageMessage).toBeInTheDocument();
    expect(getNBATeams).toHaveBeenCalledTimes(1);
  });

  it("should select Boston Celtics and display draft round counts", async () => {
    (getNBATeams as jest.Mock).mockResolvedValue(mockTeams);
    (getNBAPlayers as jest.Mock).mockResolvedValue(mockPlayers);

    render(<App />);

    const selectElement = await screen.findByLabelText(
      "Default select example"
    );

    fireEvent.change(selectElement, { target: { value: "2" } });
    const submitButton = screen.getByTestId("submitButton");
    fireEvent.click(submitButton);

    await waitFor(
      () => {
        const teamNameElement = screen.getByText("Team Name: Boston Celtics");
        const draftRoundsElement = screen.getByText('Draft Rounds: {"1":2}');

        expect(teamNameElement).toBeInTheDocument();
        expect(draftRoundsElement).toBeInTheDocument();
      },
      { timeout: 3000 }
    );

    expect(getNBATeams).toHaveBeenCalledTimes(1);
    expect(getNBAPlayers).toHaveBeenCalledWith({ teamId: "2" });
    expect(getRoundCountForSelectedTeam).toHaveBeenCalledWith({
      teamPlayers: mockPlayers,
    });
  });

  it("should display error message on balldontlie api error on player lookup", async () => {
    (getNBATeams as jest.Mock).mockResolvedValue(mockTeams);
    (getNBAPlayers as jest.Mock).mockResolvedValue([]);

    render(<App />);

    const selectElement = await screen.findByLabelText(
      "Default select example"
    );

    fireEvent.change(selectElement, { target: { value: "2" } });
    const submitButton = screen.getByTestId("submitButton");
    fireEvent.click(submitButton);

    const errorPageMessage = await screen.findByText(
      "Error: Too many attempts. Please try again after 1 minute."
    );

    expect(errorPageMessage).toBeInTheDocument();
    expect(getNBATeams).toHaveBeenCalledTimes(1);
  });
});
