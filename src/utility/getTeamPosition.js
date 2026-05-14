const getConstructorPosition = (teamName, standings) => {
  if (!Array.isArray(standings)) return null;
  for (let standing of standings) {
    if (standing["team_name"] == teamName) return standing;
  }
  return null;
}

export default getConstructorPosition