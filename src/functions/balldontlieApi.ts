import { BalldontlieAPI, NBAPlayer, NBATeam } from "@balldontlie/sdk";

// const API_KEY = process.env.BALLDONTLIE_API_KEY;
const API_KEY = "73c40546-827a-41d0-8286-6e3c1ef390b7"; // hide this key
const api = new BalldontlieAPI({ apiKey: API_KEY });

/**
 * Returns a promise of all NBA Teams.
 * @return {Promise}
 */
export async function getNBATeams(): Promise<NBATeam[]> {
  // TODO: Add option to filter out inactive teams.
  try {
    const teams = await api.nba.getTeams();
    // TODO: Possibly cache team names/id's into locale storage to reduce requests.
    return teams.data;
  } catch (error) {
    // TODO: Possibly log to observability platform like Splunk.
    console.error(error);
    return [];
  }
}

type GetPlayerParams = {
  teamId: number;
};

/**
 * Returns a promise of NBA Players for a given team.
 * @param {number} teamId - NBA team to look up.
 * @return {Promise[]}
 */
export async function getNBAPlayers({
  teamId,
}: GetPlayerParams): Promise<NBAPlayer[]> {
  try {
    const players = await api.nba.getPlayers({ team_ids: [teamId] });
    return players.data;
  } catch (error) {
    // TODO: Possibly log to observability platform like Splunk.
    console.error(error);
    return [];
  }
}

export type RoundCounts = {
  [key: number]: number;
};

type TeamPlayersParams = {
  teamPlayers: NBAPlayer[];
};

/**
 * Returns an number of players drafted for a given team in each round.
 * @param {Array} teamPlayers - List of players to process for drafts.
 * @return {Object} - Count of drafted players in in first two rounds.
 */
export function getRoundCountForSelectedTeam({
  teamPlayers,
}: TeamPlayersParams): RoundCounts {
  const DRAFT_ROUNDS = 2;
  const roundCounts: RoundCounts = {};
  if (teamPlayers) {
    for (const player of teamPlayers) {
      if (player.draft_round <= DRAFT_ROUNDS && player.draft_round !== null) {
        const round = player.draft_round;
        if (roundCounts[round]) {
          roundCounts[round] += 1;
        } else {
          roundCounts[round] = 1;
        }
      }
    }
  }
  return roundCounts;
}
