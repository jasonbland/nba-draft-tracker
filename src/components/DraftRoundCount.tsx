type DraftRoundCountParams = {
  selectedTeamName: string;
  roundCount: string;
};

export default function DraftRoundCount({
  selectedTeamName,
  roundCount,
}: DraftRoundCountParams) {
  return (
    <>
      <div>Team Name: {selectedTeamName}</div>
      {/* TODO: Display the rounds in a more readable way.*/}
      <div>Draft Rounds: {roundCount}</div>
    </>
  );
}
