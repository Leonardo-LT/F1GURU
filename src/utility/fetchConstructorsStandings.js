const fetchConstructorsStandings = async () => {
  const response = await fetch(
    "https://api.openf1.org/v1/championship_teams?meeting_key=latest&session_key=latest",
  );
  if (!response.ok) {
    throw new Error(
      `Failed to fetch constructor standings (${response.status})`,
    );
  }
  const data = await response.json();
  if (data.length === 0) {
    throw new Error("No constructor standings data available");
  }
  return data;
};

const getTeamStanding = (teamName, standings) => {
  for (let standing of standings) {
    if (standing["team_name"] == teamName) return standing;
  }

  return null;
};

export { fetchConstructorsStandings, getTeamStanding };
