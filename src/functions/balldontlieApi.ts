import { BalldontlieAPI } from "@balldontlie/sdk";

// const API_KEY = process.env.BALLDONTLIE_API_KEY;
const API_KEY = "73c40546-827a-41d0-8286-6e3c1ef390b7";
const api = new BalldontlieAPI({ apiKey: API_KEY });

export async function getNBATeams() {
  try {
    const teams = await api.nba.getTeams();
    return teams.data;
  } catch (error) {
    console.error(error);
  }
}
