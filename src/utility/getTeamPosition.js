const getConstructorPosition = (teamName, standings) => {
  for (let standing of standings) {
    if (standing["team_name"] == teamName) return standing
  }
  return null
}

export default getConstructorPosition